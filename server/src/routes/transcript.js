import express from 'express';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { extractProjectsFromTranscript } from '../services/aiParser.js';

const router = express.Router();

// Store processed hashes to prevent accidental rapid double-clicks
const processedHashes = new Set();

// Validation helper
const validateExtractedDraft = (draft, users) => {
  if (!draft || !Array.isArray(draft.projects) || draft.projects.length === 0) {
    throw new Error('AI output missing projects list or returned empty');
  }

  const userMap = new Map(users.map((u) => [u._id.toString(), u]));
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  for (const [pIdx, project] of draft.projects.entries()) {
    if (!project.name || typeof project.name !== 'string') {
      throw new Error(`Project #${pIdx + 1} is missing a valid name`);
    }
    if (!project.clientName || typeof project.clientName !== 'string') {
      throw new Error(`Project "${project.name}" is missing clientName`);
    }
    if (!project.deadline || !dateRegex.test(project.deadline)) {
      throw new Error(`Project "${project.name}" has invalid deadline format (must be YYYY-MM-DD)`);
    }

    const manager = userMap.get(project.managerId?.toString());
    if (!manager) {
      throw new Error(`Project "${project.name}" references an unknown manager ID`);
    }
    if (manager.role !== 'MANAGER') {
      throw new Error(`Project "${project.name}" manager (${manager.name}) must have MANAGER role`);
    }

    if (!Array.isArray(project.tasks) || project.tasks.length === 0) {
      throw new Error(`Project "${project.name}" contains no tasks`);
    }

    for (const [tIdx, task] of project.tasks.entries()) {
      if (!task.title || typeof task.title !== 'string') {
        throw new Error(`Task #${tIdx + 1} in "${project.name}" is missing a title`);
      }
      if (!task.deadline || !dateRegex.test(task.deadline)) {
        throw new Error(`Task "${task.title}" has invalid deadline format (must be YYYY-MM-DD)`);
      }
      if (typeof task.estimatedHours !== 'number' || task.estimatedHours <= 0) {
        throw new Error(`Task "${task.title}" must have positive estimatedHours`);
      }
      if (task.deadline > project.deadline) {
        throw new Error(`Task "${task.title}" deadline (${task.deadline}) cannot be after project deadline (${project.deadline})`);
      }

      const assignee = userMap.get(task.assigneeId?.toString());
      if (!assignee) {
        throw new Error(`Task "${task.title}" references an unknown agent ID`);
      }
      if (assignee.role !== 'AGENT') {
        throw new Error(`Task "${task.title}" assignee (${assignee.name}) must have AGENT role`);
      }
    }
  }
};

// POST /api/transcript/process (ADMIN only)
router.post('/process', requireAuth, requireRole('ADMIN'), async (req, res) => {
  const { transcript } = req.body || {};

  if (!transcript || typeof transcript !== 'string' || transcript.trim().length < 50) {
    return res.status(400).json({
      error: 'Please provide a valid meeting transcript (minimum 50 characters)',
    });
  }

  // Idempotency check using hash
  const transcriptHash = crypto.createHash('sha256').update(transcript.trim()).digest('hex');
  if (processedHashes.has(transcriptHash)) {
    const existing = await Project.find().populate('managerId', 'name email');
    return res.json({
      message: 'This transcript has already been processed',
      duplicate: true,
      projectsCreated: 0,
      tasksCreated: 0,
      projects: existing,
    });
  }

  try {
    // 1. Fetch safe team directory (passwords omitted)
    const users = await User.find().select('_id name email role specialization skills');

    // 2. Call AI extraction service
    const draft = await extractProjectsFromTranscript(transcript, users);

    // 3. Strict validation before touching database
    validateExtractedDraft(draft, users);

    // 4. Check if duplicate projects already exist by name
    const projectNames = draft.projects.map((p) => p.name);
    const existingProjects = await Project.find({ name: { $in: projectNames } });
    if (existingProjects.length > 0) {
      return res.status(409).json({
        error: `Projects already exist in the database: ${existingProjects.map((p) => p.name).join(', ')}. Please delete them first or submit a different project transcript.`,
      });
    }

    // 5. Atomic save with rollback guarantee
    const createdProjectIds = [];
    const createdTaskIds = [];
    const savedProjects = [];

    try {
      for (const projData of draft.projects) {
        const newProject = await Project.create({
          name: projData.name,
          clientName: projData.clientName,
          description: projData.description || '',
          managerId: projData.managerId,
          deadline: projData.deadline,
        });
        createdProjectIds.push(newProject._id);

        const projectTasks = [];
        for (const taskData of projData.tasks) {
          const newTask = await Task.create({
            projectId: newProject._id,
            title: taskData.title,
            description: taskData.description || '',
            assigneeId: taskData.assigneeId,
            deadline: taskData.deadline,
            estimatedHours: taskData.estimatedHours,
          });
          createdTaskIds.push(newTask._id);
          projectTasks.push(newTask);
        }

        savedProjects.push({
          ...newProject.toObject(),
          tasks: projectTasks,
        });
      }

      // Mark hash as processed
      processedHashes.add(transcriptHash);

      return res.status(201).json({
        message: `Successfully created ${savedProjects.length} projects with ${createdTaskIds.length} tasks from transcript`,
        projectsCreated: savedProjects.length,
        tasksCreated: createdTaskIds.length,
        projects: savedProjects,
      });
    } catch (saveError) {
      // Rollback: delete any created records
      if (createdTaskIds.length > 0) {
        await Task.deleteMany({ _id: { $in: createdTaskIds } });
      }
      if (createdProjectIds.length > 0) {
        await Project.deleteMany({ _id: { $in: createdProjectIds } });
      }
      throw saveError;
    }
  } catch (err) {
    console.error('[Transcript Ingestion Error]:', err);
    return res.status(422).json({
      error: err.message || 'Failed to process and validate transcript',
    });
  }
});

export default router;

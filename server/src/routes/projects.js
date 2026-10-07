import express from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply requireAuth to all project routes
router.use(requireAuth);

// GET /api/projects
router.get('/', async (req, res) => {
  try {
    const { role, _id: userId } = req.user;
    let projects = [];

    if (role === 'ADMIN') {
      // ADMIN: all projects
      projects = await Project.find()
        .populate('managerId', 'name email specialization')
        .sort({ createdAt: -1 });
    } else if (role === 'MANAGER') {
      // MANAGER: only projects where managerId === req.user.id
      projects = await Project.find({ managerId: userId })
        .populate('managerId', 'name email specialization')
        .sort({ createdAt: -1 });
    } else if (role === 'AGENT') {
      // AGENT: only distinct projects containing tasks assigned to them
      const agentTasks = await Task.find({ assigneeId: userId }).select('projectId');
      const projectIds = [...new Set(agentTasks.map((t) => t.projectId.toString()))];
      projects = await Project.find({ _id: { $in: projectIds } })
        .populate('managerId', 'name email specialization')
        .sort({ createdAt: -1 });
    }

    return res.json(projects);
  } catch (err) {
    console.error('[Projects GET Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Project not found' });
  }

  try {
    const { role, _id: userId } = req.user;
    const project = await Project.findById(id).populate('managerId', 'name email specialization');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Role-based authorization
    let tasks = [];

    if (role === 'ADMIN') {
      // ADMIN: sees project and all tasks
      tasks = await Task.find({ projectId: project._id })
        .populate('assigneeId', 'name email specialization')
        .sort({ deadline: 1 });
    } else if (role === 'MANAGER') {
      // MANAGER: only if they manage that project
      const isManager = project.managerId._id
        ? project.managerId._id.equals(userId)
        : project.managerId.equals(userId);

      if (!isManager) {
        return res.status(404).json({ error: 'Project not found' });
      }

      tasks = await Task.find({ projectId: project._id })
        .populate('assigneeId', 'name email specialization')
        .sort({ deadline: 1 });
    } else if (role === 'AGENT') {
      // AGENT: only if they have at least one task assigned to them in that project
      const userTasks = await Task.find({
        projectId: project._id,
        assigneeId: userId,
      })
        .populate('assigneeId', 'name email specialization')
        .sort({ deadline: 1 });

      if (userTasks.length === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Return ONLY their own tasks, never other agents' tasks
      tasks = userTasks;
    }

    return res.json({ project, tasks });
  } catch (err) {
    console.error('[Project Detail GET Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch project details' });
  }
});

export default router;

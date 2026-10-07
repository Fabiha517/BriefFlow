import express from 'express';
import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply requireAuth to all task routes
router.use(requireAuth);

// GET /api/tasks
router.get('/', async (req, res) => {
  try {
    const { role, _id: userId } = req.user;
    let tasks = [];

    if (role === 'ADMIN') {
      // ADMIN: all tasks
      tasks = await Task.find()
        .populate('projectId', 'name clientName deadline')
        .populate('assigneeId', 'name email specialization')
        .sort({ deadline: 1 });
    } else if (role === 'MANAGER') {
      // MANAGER: tasks belonging to projects they manage
      const managedProjects = await Project.find({ managerId: userId }).select('_id');
      const projectIds = managedProjects.map((p) => p._id);

      tasks = await Task.find({ projectId: { $in: projectIds } })
        .populate('projectId', 'name clientName deadline')
        .populate('assigneeId', 'name email specialization')
        .sort({ deadline: 1 });
    } else if (role === 'AGENT') {
      // AGENT: only tasks where assigneeId === req.user.id
      tasks = await Task.find({ assigneeId: userId })
        .populate('projectId', 'name clientName deadline')
        .populate('assigneeId', 'name email specialization')
        .sort({ deadline: 1 });
    }

    return res.json(tasks);
  } catch (err) {
    console.error('[Tasks GET Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'Task not found' });
  }

  try {
    const { role, _id: userId } = req.user;
    const task = await Task.findById(id)
      .populate('projectId', 'name clientName deadline managerId')
      .populate('assigneeId', 'name email specialization');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Role-based visibility check
    if (role === 'ADMIN') {
      // ADMIN: can access any task
      return res.json(task);
    }

    if (role === 'MANAGER') {
      // MANAGER: only if task belongs to a project they manage
      const projectManagerId = task.projectId?.managerId;
      const isManager = projectManagerId && (
        projectManagerId._id ? projectManagerId._id.equals(userId) : projectManagerId.equals(userId)
      );

      if (!isManager) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.json(task);
    }

    if (role === 'AGENT') {
      // AGENT: only if assigneeId === req.user.id
      const isAssignee = task.assigneeId && (
        task.assigneeId._id ? task.assigneeId._id.equals(userId) : task.assigneeId.equals(userId)
      );

      if (!isAssignee) {
        return res.status(404).json({ error: 'Task not found' });
      }

      return res.json(task);
    }

    return res.status(404).json({ error: 'Task not found' });
  } catch (err) {
    console.error('[Task Detail GET Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch task details' });
  }
});

export default router;

import express from 'express';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply requireAuth to team directory
router.use(requireAuth);

// GET /api/team
router.get('/', async (req, res) => {
  try {
    const team = await User.find()
      .select('_id name email role specialization skills')
      .sort({ role: 1, name: 1 });

    const formattedTeam = team.map((member) => ({
      id: member._id,
      name: member.name,
      email: member.email,
      role: member.role,
      specialization: member.specialization,
      skills: member.skills,
    }));

    return res.json(formattedTeam);
  } catch (err) {
    console.error('[Team Directory GET Error]:', err);
    return res.status(500).json({ error: 'Failed to fetch team directory' });
  }
});

export default router;

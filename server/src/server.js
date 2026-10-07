import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import projectsRoutes from './routes/projects.js';
import tasksRoutes from './routes/tasks.js';
import teamRoutes from './routes/team.js';
import transcriptRoutes from './routes/transcript.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/transcript', transcriptRoutes);

// Health & Status route
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    app: 'BriefFlow CRM API',
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: {
      status: states[dbState] || 'unknown',
      connected: dbState === 1
    }
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    name: 'BriefFlow Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health'
    }
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[BriefFlow Server]: Running on http://localhost:${PORT}`);
  });
};

startServer();

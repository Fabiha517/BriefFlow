import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectDB } from './config/db.js';
import { User } from './models/User.js';

dotenv.config();

export const DEMO_USERS = [
  {
    name: 'Admin',
    email: 'admin@novaworks.example',
    role: 'ADMIN',
    specialization: 'Administrator',
    skills: ['Company overview', 'transcript creation'],
  },
  {
    name: 'Ayesha Khan',
    email: 'ayesha@novaworks.example',
    role: 'MANAGER',
    specialization: 'Web PM',
    skills: ['Web projects', 'client coordination'],
  },
  {
    name: 'Bilal Ahmed',
    email: 'bilal@novaworks.example',
    role: 'MANAGER',
    specialization: 'Mobile PM',
    skills: ['Mobile projects', 'delivery planning'],
  },
  {
    name: 'Hina Malik',
    email: 'hina@novaworks.example',
    role: 'MANAGER',
    specialization: 'AI PM',
    skills: ['AI projects', 'requirement review'],
  },
  {
    name: 'Ali Raza',
    email: 'ali@novaworks.example',
    role: 'AGENT',
    specialization: 'Full-Stack',
    skills: ['React', 'frontend integration'],
  },
  {
    name: 'Hamza Shah',
    email: 'hamza@novaworks.example',
    role: 'AGENT',
    specialization: 'Full-Stack',
    skills: ['Node.js', 'databases', 'APIs'],
  },
  {
    name: 'Sara Noor',
    email: 'sara@novaworks.example',
    role: 'AGENT',
    specialization: 'App Developer',
    skills: ['Flutter', 'mobile UI'],
  },
  {
    name: 'Usman Tariq',
    email: 'usman@novaworks.example',
    role: 'AGENT',
    specialization: 'App Developer',
    skills: ['Flutter', 'integration', 'testing'],
  },
  {
    name: 'Zain Abbas',
    email: 'zain@novaworks.example',
    role: 'AGENT',
    specialization: 'AI Developer',
    skills: ['LLMs', 'extraction', 'prompts'],
  },
  {
    name: 'Maryam Asif',
    email: 'maryam@novaworks.example',
    role: 'AGENT',
    specialization: 'AI Developer',
    skills: ['Retrieval', 'document processing'],
  },
];

const DEMO_PASSWORD = 'Demo123!';

export const seedUsers = async () => {
  try {
    console.log('[Seeder] Connecting to MongoDB...');
    await connectDB();

    console.log('[Seeder] Generating bcrypt hash for default demo password...');
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    console.log(`[Seeder] Upserting ${DEMO_USERS.length} demo users...`);
    const results = [];

    for (const demoUser of DEMO_USERS) {
      const user = await User.findOneAndUpdate(
        { email: demoUser.email.toLowerCase() },
        {
          name: demoUser.name,
          email: demoUser.email.toLowerCase(),
          role: demoUser.role,
          specialization: demoUser.specialization,
          skills: demoUser.skills,
          passwordHash,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
      results.push(user);
    }

    const totalUsers = await User.countDocuments();
    console.log(`[Seeder] Successfully seeded. Total users in database: ${totalUsers}`);
    console.log('------------------------------------------------------------');
    console.table(
      results.map((u) => ({
        Name: u.name,
        Email: u.email,
        Role: u.role,
        Specialization: u.specialization,
        Skills: u.skills.join(', '),
      }))
    );
    console.log('------------------------------------------------------------');

    return results;
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('[Seeder] Disconnected from MongoDB.');
  }
};

// Execute if run directly
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedUsers();
}

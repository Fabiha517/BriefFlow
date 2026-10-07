import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deadline: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Deadline must be formatted as YYYY-MM-DD'],
    },
    estimatedHours: {
      type: Number,
      required: true,
      min: [0.1, 'Estimated hours must be a positive number'],
    },
  },
  {
    timestamps: true,
  }
);

export const Task = mongoose.model('Task', taskSchema);

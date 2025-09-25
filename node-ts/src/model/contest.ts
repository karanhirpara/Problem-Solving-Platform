import { appendFile } from 'fs';
import mongoose, { Document, Schema } from 'mongoose';
export interface Problem {
  id: string
}
export interface Contest extends Document  {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
const contestSchema = new Schema<Contest>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 5000
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
   status: {
    type: String,
    enum: ['live', 'upcoming', 'finished'],
    default: 'upcoming'
   },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});





 
export const Contest = mongoose.model<Contest>('Contest', contestSchema);
// models/Contest.ts


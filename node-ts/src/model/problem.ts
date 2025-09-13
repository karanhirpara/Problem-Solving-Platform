import mongoose, { Document, Schema } from 'mongoose';

interface IProblem extends Document {
  problemName: string;
  statement: string;
  input: string;
  output: string;
  exampleInput: string;
  exampleOutput: string;
  allInput: string;
  allOutput: string;
  note?: string;
  visible: boolean;
  contest: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const problemSchema = new Schema<IProblem>({
  problemName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  statement: {
    type: String,
    required: true,
    maxLength: 10000
  },
  input: {
    type: String,
    required: true,
    maxLength: 5000
  },
  output: {
    type: String,
    required: true,
    maxLength: 5000
  },
  exampleInput: {
    type: String,
    required: true,
    maxLength: 100000 // 10^5 constraint
  },
  exampleOutput: {
    type: String,
    required: true,
    maxLength: 100000
  },
  allInput: {
    type: String,
    maxLength: 500000 // Larger for multiple test cases
  },
  allOutput: {
    type: String,
    maxLength: 500000
  },
  note: {
    type: String,
    maxLength: 2000
  },
  visible: {
    type: Boolean,
    default: false
  },  
  contest: {
    type: Schema.Types.ObjectId,
    ref: 'Contest'
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

problemSchema.index({ problemName: 'text', tags: 1 });
problemSchema.index({ difficulty: 1, 'statistics.accepted': -1 });
problemSchema.index({ createdAt: -1 });

export const Problem = mongoose.model<IProblem>('Problem', problemSchema);
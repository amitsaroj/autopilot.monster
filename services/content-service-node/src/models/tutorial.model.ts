/**
 * Tutorial Model
 */

import { Schema, model, Document } from 'mongoose';
import { getDatabase } from '../../../../shared/config/db';

export interface ITutorial extends Document {
  tutorialId: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  author: string;
  authorId: string;
  videoUrl?: string;
  attachments?: string[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  viewCount: number;
  likeCount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const tutorialSchema = new Schema<ITutorial>(
  {
    tutorialId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      index: 'text',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    duration: {
      type: Number,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
      index: true,
    },
    videoUrl: String,
    attachments: [String],
    tags: [String],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

const connection = getDatabase('content-service');
export const Tutorial = connection
  ? connection.model<ITutorial>('Tutorial', tutorialSchema)
  : model<ITutorial>('Tutorial', tutorialSchema);

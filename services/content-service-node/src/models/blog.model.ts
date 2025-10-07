/**
 * Blog Model
 */

import { Schema, model, Document } from 'mongoose';
import { getDatabase } from '../../../../shared/config/db';

export interface IBlog extends Document {
  blogId: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: string;
  authorId: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  status: 'draft' | 'published' | 'archived';
  publishedAt?: Date;
  viewCount: number;
  likeCount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    blogId: {
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
    content: {
      type: String,
      required: true,
    },
    excerpt: String,
    author: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    tags: [String],
    featuredImage: String,
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    publishedAt: Date,
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

blogSchema.index({ title: 'text', content: 'text' });

const connection = getDatabase('content-service');
export const Blog = connection
  ? connection.model<IBlog>('Blog', blogSchema)
  : model<IBlog>('Blog', blogSchema);

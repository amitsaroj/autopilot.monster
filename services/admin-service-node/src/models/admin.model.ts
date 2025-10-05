/**
 * Admin Model
 */

import { Schema, model, Document } from 'mongoose';
import { getDatabase } from '../../../../shared/config/db';

export interface IAdmin extends Document {
  adminId: string;
  userId: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  isActive: boolean;
  lastLogin?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['super_admin', 'admin', 'moderator'],
      default: 'moderator',
    },
    permissions: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

const connection = getDatabase('admin-service');
export const Admin = connection
  ? connection.model<IAdmin>('Admin', adminSchema)
  : model<IAdmin>('Admin', adminSchema);

/**
 * Approval Model
 */

import { Schema, model, Document } from 'mongoose';
import { getDatabase } from '../../../../shared/config/db';

export interface IApproval extends Document {
  approvalId: string;
  type: 'vendor' | 'product' | 'blog' | 'tutorial' | 'review';
  entityId: string;
  entityData: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  comments?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const approvalSchema = new Schema<IApproval>(
  {
    approvalId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['vendor', 'product', 'blog', 'tutorial', 'review'],
      required: true,
      index: true,
    },
    entityId: {
      type: String,
      required: true,
      index: true,
    },
    entityData: {
      type: Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    reviewedBy: String,
    reviewedAt: Date,
    comments: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

const connection = getDatabase('admin-service');
export const Approval = connection
  ? connection.model<IApproval>('Approval', approvalSchema)
  : model<IApproval>('Approval', approvalSchema);

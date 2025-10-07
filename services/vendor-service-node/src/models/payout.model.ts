/**
 * Payout Model
 */

import { Schema, model, Document } from 'mongoose';
import { getDatabase } from '../../../../shared/config/db';

export interface IPayout extends Document {
  payoutId: string;
  vendorId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  method: 'bank_transfer' | 'paypal' | 'stripe';
  transactionId?: string;
  failureReason?: string;
  processedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const payoutSchema = new Schema<IPayout>(
  {
    payoutId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    vendorId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    method: {
      type: String,
      enum: ['bank_transfer', 'paypal', 'stripe'],
      required: true,
    },
    transactionId: String,
    failureReason: String,
    processedAt: Date,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

const connection = getDatabase('vendor-service');
export const Payout = connection
  ? connection.model<IPayout>('Payout', payoutSchema)
  : model<IPayout>('Payout', payoutSchema);

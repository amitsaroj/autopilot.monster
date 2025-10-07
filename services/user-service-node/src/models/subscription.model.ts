/**
 * User Subscription Model
 */

import { Schema, model, Document } from 'mongoose';
import { getDatabase } from '../../../../shared/config/db';

export interface ISubscription extends Document {
  userId: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod?: string;
  features: string[];
  billingCycle: 'monthly' | 'yearly';
  amount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'trial'],
      default: 'trial',
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true },
    paymentMethod: String,
    features: [String],
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
    amount: { type: Number, required: true },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1, status: 1 });

const connection = getDatabase('user-service');
export const Subscription = connection
  ? connection.model<ISubscription>('Subscription', subscriptionSchema)
  : model<ISubscription>('Subscription', subscriptionSchema);


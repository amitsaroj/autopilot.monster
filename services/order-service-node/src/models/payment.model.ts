/**
 * Payment Model
 */

import { Schema, model, Document } from 'mongoose';
import { getDatabase } from '../../../../shared/config/db';

export interface IPayment extends Document {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  method: 'card' | 'paypal' | 'stripe' | 'bank_transfer' | 'wallet';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  gatewayResponse?: Record<string, any>;
  failureReason?: string;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    paymentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
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
    method: {
      type: String,
      enum: ['card', 'paypal', 'stripe', 'bank_transfer', 'wallet'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    transactionId: String,
    gatewayResponse: Schema.Types.Mixed,
    failureReason: String,
    refundAmount: Number,
    refundReason: String,
    refundedAt: Date,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

const connection = getDatabase('order-service');
export const Payment = connection
  ? connection.model<IPayment>('Payment', paymentSchema)
  : model<IPayment>('Payment', paymentSchema);



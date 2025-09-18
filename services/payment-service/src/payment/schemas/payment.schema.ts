import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  userId: string;

  @Prop()
  orderId?: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ 
    type: String, 
    enum: ['PAYMENT_STATUS_PENDING', 'PAYMENT_STATUS_COMPLETED', 'PAYMENT_STATUS_FAILED', 'PAYMENT_STATUS_CANCELLED', 'PAYMENT_STATUS_REFUNDED'],
    default: 'PAYMENT_STATUS_PENDING'
  })
  status: string;

  @Prop({ 
    type: String, 
    enum: ['stripe', 'razorpay', 'paypal', 'bank_transfer']
  })
  paymentMethod: string;

  @Prop()
  transactionId?: string;

  @Prop()
  paymentIntentId?: string;

  @Prop()
  clientSecret?: string;

  @Prop()
  refundFor?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  completedAt?: Date;

  @Prop()
  failedAt?: Date;

  @Prop()
  cancelledAt?: Date;

  @Prop()
  refundedAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Indexes
PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ paymentMethod: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ paymentIntentId: 1 });
PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ completedAt: -1 });

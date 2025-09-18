import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: true })
export class Subscription {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  planId: string;

  @Prop({ required: true })
  planName: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ 
    type: String, 
    enum: ['monthly', 'yearly', 'lifetime']
  })
  interval: string;

  @Prop({ 
    type: String, 
    enum: ['SUBSCRIPTION_STATUS_PENDING', 'SUBSCRIPTION_STATUS_ACTIVE', 'SUBSCRIPTION_STATUS_CANCELLED', 'SUBSCRIPTION_STATUS_EXPIRED', 'SUBSCRIPTION_STATUS_PAST_DUE'],
    default: 'SUBSCRIPTION_STATUS_PENDING'
  })
  status: string;

  @Prop({ 
    type: String, 
    enum: ['stripe', 'razorpay', 'paypal']
  })
  paymentMethod: string;

  @Prop()
  stripeSubscriptionId?: string;

  @Prop()
  razorpaySubscriptionId?: string;

  @Prop()
  paypalSubscriptionId?: string;

  @Prop({ required: true })
  currentPeriodStart: Date;

  @Prop({ required: true })
  currentPeriodEnd: Date;

  @Prop()
  cancelledAt?: Date;

  @Prop()
  cancellationReason?: string;

  @Prop()
  expiresAt?: Date;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop({ default: 0 })
  trialDays: number;

  @Prop()
  trialEndsAt?: Date;

  @Prop({ default: false })
  isTrialActive: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

// Indexes
SubscriptionSchema.index({ userId: 1 });
SubscriptionSchema.index({ planId: 1 });
SubscriptionSchema.index({ status: 1 });
SubscriptionSchema.index({ stripeSubscriptionId: 1 });
SubscriptionSchema.index({ razorpaySubscriptionId: 1 });
SubscriptionSchema.index({ currentPeriodEnd: 1 });
SubscriptionSchema.index({ createdAt: -1 });

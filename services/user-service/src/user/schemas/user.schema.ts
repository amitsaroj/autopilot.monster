import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  avatar?: string;

  @Prop()
  phone?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  bio?: string;

  @Prop()
  website?: string;

  @Prop()
  location?: string;

  @Prop()
  timezone?: string;

  @Prop()
  language?: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  phoneVerificationToken?: string;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop()
  lastLoginAt?: Date;

  @Prop()
  lastLoginIp?: string;

  @Prop({ type: Object })
  preferences: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'friends';
      showEmail: boolean;
      showPhone: boolean;
    };
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
  };

  @Prop({ type: Object })
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };

  @Prop({ type: Object })
  billing: {
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    taxId?: string;
    companyName?: string;
  };

  @Prop({ type: Object })
  subscription: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    status: 'active' | 'inactive' | 'cancelled' | 'past_due';
    startDate?: Date;
    endDate?: Date;
    autoRenew: boolean;
    paymentMethod?: string;
  };

  @Prop({ type: Object })
  stats: {
    totalOrders: number;
    totalSpent: number;
    totalDownloads: number;
    totalReviews: number;
    averageRating: number;
    joinDate: Date;
    lastActivity: Date;
  };

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ 'subscription.plan': 1 });
UserSchema.index({ 'subscription.status': 1 });

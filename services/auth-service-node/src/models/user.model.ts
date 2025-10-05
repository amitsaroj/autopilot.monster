/**
 * User Model
 * MongoDB schema for users with authentication
 */

import { Schema, model, Document } from 'mongoose';
import { getDatabase } from '../../../../shared/config/db';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  role: 'user' | 'vendor' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'deleted';
  emailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  refreshTokens: string[];
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  metadata?: {
    provider?: 'local' | 'google' | 'github';
    providerId?: string;
    phone?: string;
    company?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'vendor', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'deleted'],
      default: 'active',
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshTokens: [String],
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,
    metadata: {
      provider: {
        type: String,
        enum: ['local', 'google', 'github'],
        default: 'local',
      },
      providerId: String,
      phone: String,
      company: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });

// Virtual for full name
userSchema.pre('save', function (next) {
  if (this.firstName && this.lastName) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
  next();
});

// Get database connection for auth service
const connection = getDatabase('auth-service');

export const User = connection 
  ? connection.model<IUser>('User', userSchema) 
  : model<IUser>('User', userSchema);


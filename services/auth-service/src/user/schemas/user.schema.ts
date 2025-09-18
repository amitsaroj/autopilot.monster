import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  company?: string;

  @Prop()
  bio?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ 
    type: String, 
    enum: ['USER_ROLE_CUSTOMER', 'USER_ROLE_VENDOR', 'USER_ROLE_ADMIN', 'USER_ROLE_SUPER_ADMIN'],
    default: 'USER_ROLE_CUSTOMER'
  })
  role: string;

  @Prop({ 
    type: String, 
    enum: ['USER_STATUS_ACTIVE', 'USER_STATUS_PENDING', 'USER_STATUS_SUSPENDED', 'USER_STATUS_DELETED'],
    default: 'USER_STATUS_PENDING'
  })
  status: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  emailVerificationToken?: string;

  @Prop()
  emailVerificationExpiry?: Date;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpiry?: Date;

  @Prop({ type: [String], default: [] })
  passwordHistory: string[];

  @Prop({ default: 0 })
  loginAttempts: number;

  @Prop()
  lockUntil?: Date;

  @Prop()
  lastLogin?: Date;

  @Prop({ default: false })
  isLocked: boolean;

  @Prop({ type: Object })
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };

  @Prop({ type: Object })
  oauthProviders?: {
    google?: {
      id: string;
      email: string;
    };
    github?: {
      id: string;
      email: string;
    };
  };

  @Prop({ default: false })
  twoFactorEnabled: boolean;

  @Prop()
  twoFactorSecret?: string;

  @Prop({ type: [String] })
  twoFactorBackupCodes?: string[];

  @Prop({ type: Object })
  preferences?: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisibility: string;
      showEmail: boolean;
    };
    language: string;
    timezone: string;
  };

  @Prop({ type: Object })
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    lastSeen?: Date;
    registrationSource?: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ emailVerificationToken: 1 });
UserSchema.index({ passwordResetToken: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ lastLogin: -1 });

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for account lock status
UserSchema.virtual('isAccountLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Pre-save middleware
UserSchema.pre('save', function(next) {
  if (this.isModified('lockUntil')) {
    this.isLocked = !!(this.lockUntil && this.lockUntil > new Date());
  }
  next();
});
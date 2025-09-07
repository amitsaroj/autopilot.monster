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
  company: string;

  @Prop()
  bio: string;

  @Prop()
  avatarUrl: string;

  @Prop({ 
    type: String, 
    enum: ['USER_ROLE_CUSTOMER', 'USER_ROLE_VENDOR', 'USER_ROLE_ADMIN', 'USER_ROLE_SUPER_ADMIN'],
    default: 'USER_ROLE_CUSTOMER'
  })
  role: string;

  @Prop({ 
    type: String, 
    enum: ['USER_STATUS_PENDING', 'USER_STATUS_ACTIVE', 'USER_STATUS_SUSPENDED', 'USER_STATUS_BANNED', 'USER_STATUS_DELETED'],
    default: 'USER_STATUS_PENDING'
  })
  status: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  emailVerificationToken: string;

  @Prop()
  emailVerificationExpiry: Date;

  @Prop()
  passwordResetToken: string;

  @Prop()
  passwordResetExpiry: Date;

  @Prop({ type: [String], default: [] })
  passwordHistory: string[];

  @Prop({ type: Object, default: {} })
  socialLinks: Record<string, string>;

  @Prop({ type: Object, default: {} })
  oauthProviders: Record<string, any>;

  @Prop({ default: 0 })
  loginAttempts: number;

  @Prop()
  lockUntil: Date;

  @Prop()
  lastLogin: Date;

  @Prop()
  lastLoginIp: string;

  @Prop({ default: false })
  twoFactorEnabled: boolean;

  @Prop()
  twoFactorSecret: string;

  @Prop({ type: [String], default: [] })
  twoFactorBackupCodes: string[];

  @Prop({ type: Object, default: {} })
  preferences: Record<string, any>;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  // Virtual for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Virtual for checking if account is locked
  get isLocked(): boolean {
    return !!(this.lockUntil && this.lockUntil > new Date());
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ createdAt: -1 });

// Virtuals
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > new Date());
});

// Transform output
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.passwordHistory;
    delete ret.emailVerificationToken;
    delete ret.passwordResetToken;
    delete ret.twoFactorSecret;
    delete ret.twoFactorBackupCodes;
    return ret;
  },
});

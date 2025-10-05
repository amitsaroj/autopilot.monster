/**
 * User Profile Model
 */

import { Schema, model, Document } from 'mongoose';
import { getDatabase } from '../../../../shared/config/db';

export interface IProfile extends Document {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  dateOfBirth?: Date;
  bio?: string;
  company?: string;
  location?: string;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
  };
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  metadata?: Record<string, any>;
  lastActive: Date;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    avatar: String,
    phone: String,
    dateOfBirth: Date,
    bio: String,
    company: String,
    location: String,
    preferences: {
      newsletter: { type: Boolean, default: true },
      notifications: { type: Boolean, default: true },
      language: { type: String, default: 'en' },
      timezone: { type: String, default: 'UTC' },
      theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
    },
    social: {
      twitter: String,
      linkedin: String,
      github: String,
      website: String,
    },
    metadata: Schema.Types.Mixed,
    lastActive: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

profileSchema.index({ email: 1 });
profileSchema.index({ userId: 1 });

const connection = getDatabase('user-service');
export const Profile = connection
  ? connection.model<IProfile>('Profile', profileSchema)
  : model<IProfile>('Profile', profileSchema);


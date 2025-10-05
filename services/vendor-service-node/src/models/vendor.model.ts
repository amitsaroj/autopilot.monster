/**
 * Vendor Model
 */

import { Schema, model, Document } from 'mongoose';
import { getDatabase } from '../../../../shared/config/db';

export interface IVendor extends Document {
  vendorId: string;
  userId: string;
  businessName: string;
  email: string;
  phone?: string;
  website?: string;
  logo?: string;
  description?: string;
  category: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  verificationStatus: 'unverified' | 'pending' | 'verified';
  rating: number;
  reviewCount: number;
  totalSales: number;
  totalRevenue: number;
  productCount: number;
  businessAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    routingNumber?: string;
  };
  taxInfo?: {
    taxId: string;
    taxType: string;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const vendorSchema = new Schema<IVendor>(
  {
    vendorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: String,
    website: String,
    logo: String,
    description: String,
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended', 'rejected'],
      default: 'pending',
      index: true,
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified'],
      default: 'unverified',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    productCount: {
      type: Number,
      default: 0,
    },
    businessAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      routingNumber: String,
    },
    taxInfo: {
      taxId: String,
      taxType: String,
    },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

const connection = getDatabase('vendor-service');
export const Vendor = connection
  ? connection.model<IVendor>('Vendor', vendorSchema)
  : model<IVendor>('Vendor', vendorSchema);

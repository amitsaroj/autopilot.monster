import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type VendorDocument = Vendor & Document;

@Schema({ timestamps: true })
export class Vendor {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  businessName: string;

  @Prop()
  businessType: string;

  @Prop()
  description: string;

  @Prop()
  website?: string;

  @Prop()
  logo?: string;

  @Prop()
  phone?: string;

  @Prop({ type: Object })
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  @Prop({ type: Object })
  businessInfo: {
    taxId?: string;
    registrationNumber?: string;
    businessLicense?: string;
    industry: string;
    foundedYear?: number;
    employeeCount?: string;
  };

  @Prop({ type: Object })
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position: string;
  };

  @Prop({ default: 'pending' })
  status: string; // pending, approved, rejected, suspended

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ type: Object })
  kyc: {
    status: string; // pending, verified, rejected, expired
    submittedAt?: Date;
    verifiedAt?: Date;
    documents: {
      businessLicense?: string;
      taxCertificate?: string;
      bankStatement?: string;
      identityDocument?: string;
    };
    verificationNotes?: string;
  };

  @Prop({ type: Object })
  bankAccount: {
    accountHolderName: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    accountType: string; // checking, savings
    isVerified: boolean;
  };

  @Prop({ type: Object })
  payout: {
    method: string; // bank_transfer, paypal, stripe
    schedule: string; // daily, weekly, monthly
    minimumAmount: number;
    lastPayoutDate?: Date;
    nextPayoutDate?: Date;
    totalEarnings: number;
    totalPayouts: number;
    pendingAmount: number;
  };

  @Prop({ type: Object })
  commission: {
    rate: number; // percentage
    type: string; // fixed, tiered
    tiers?: Array<{
      minSales: number;
      maxSales?: number;
      rate: number;
    }>;
  };

  @Prop({ type: Object })
  stats: {
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
    totalOrders: number;
    averageRating: number;
    totalReviews: number;
    joinDate: Date;
    lastActivity: Date;
  };

  @Prop({ type: [String] })
  categories: string[];

  @Prop({ type: Object })
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      showContactInfo: boolean;
      showSalesData: boolean;
    };
    autoApprove: boolean;
    requireApproval: boolean;
  };

  @Prop({ type: Object })
  socialLinks: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);

// Indexes
VendorSchema.index({ email: 1 });
VendorSchema.index({ businessName: 1 });
VendorSchema.index({ status: 1 });
VendorSchema.index({ isVerified: 1 });
VendorSchema.index({ isActive: 1 });
VendorSchema.index({ 'kyc.status': 1 });
VendorSchema.index({ createdAt: -1 });
VendorSchema.index({ 'stats.totalRevenue': -1 });

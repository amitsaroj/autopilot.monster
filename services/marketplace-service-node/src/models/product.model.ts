/**
 * Product Model
 */

import { Schema, model, Document } from 'mongoose';
import { getDatabase } from '../../../../shared/config/db';

export interface IProduct extends Document {
  productId: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  subcategory?: string;
  tags: string[];
  vendorId: string;
  vendorName: string;
  images: string[];
  thumbnail?: string;
  features: string[];
  specifications?: Record<string, any>;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  stock: number;
  sku?: string;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  viewCount: number;
  isFeatured: boolean;
  isPopular: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: 'text',
    },
    description: {
      type: String,
      required: true,
      index: 'text',
    },
    shortDescription: String,
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: Number,
    currency: {
      type: String,
      default: 'USD',
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    subcategory: String,
    tags: [String],
    vendorId: {
      type: String,
      required: true,
      index: true,
    },
    vendorName: {
      type: String,
      required: true,
    },
    images: [String],
    thumbnail: String,
    features: [String],
    specifications: Schema.Types.Mixed,
    status: {
      type: String,
      enum: ['active', 'inactive', 'draft', 'archived'],
      default: 'draft',
      index: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    sku: String,
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
    downloadCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ vendorId: 1, status: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ price: 1 });

const connection = getDatabase('marketplace-service');
export const Product = connection
  ? connection.model<IProduct>('Product', productSchema)
  : model<IProduct>('Product', productSchema);


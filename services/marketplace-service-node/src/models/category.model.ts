/**
 * Category Model
 */

import { Schema, model, Document } from 'mongoose';
import { getDatabase } from '../../../../shared/config/db';

export interface ICategory extends Document {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  productCount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    categoryId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: String,
    icon: String,
    image: String,
    parentId: {
      type: String,
      index: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    productCount: {
      type: Number,
      default: 0,
    },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

const connection = getDatabase('marketplace-service');
export const Category = connection
  ? connection.model<ICategory>('Category', categorySchema)
  : model<ICategory>('Category', categorySchema);


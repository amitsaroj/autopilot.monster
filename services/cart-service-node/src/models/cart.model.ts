/**
 * Cart Model
 */

import { Schema, model, Document } from 'mongoose';
import { getDatabase } from '../../../../shared/config/db';

export interface ICartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  thumbnail?: string;
  vendorId: string;
  subtotal: number;
}

export interface ICart extends Document {
  userId: string;
  items: ICartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  total: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  thumbnail: String,
  vendorId: { type: String, required: true },
  subtotal: { type: Number, required: true },
}, { _id: false });

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: String,
    tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      index: true,
    },
  },
  { timestamps: true }
);

const connection = getDatabase('cart-service');
export const Cart = connection
  ? connection.model<ICart>('Cart', cartSchema)
  : model<ICart>('Cart', cartSchema);


/**
 * User Wishlist Model
 */

import { Schema, model, Document } from 'mongoose';
import { getDatabase } from '../../../../shared/config/db';

export interface IWishlistItem {
  productId: string;
  productName: string;
  productPrice: number;
  addedAt: Date;
}

export interface IWishlist extends Document {
  userId: string;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistItemSchema = new Schema<IWishlistItem>({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  productPrice: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
}, { _id: false });

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
);

const connection = getDatabase('user-service');
export const Wishlist = connection
  ? connection.model<IWishlist>('Wishlist', wishlistSchema)
  : model<IWishlist>('Wishlist', wishlistSchema);


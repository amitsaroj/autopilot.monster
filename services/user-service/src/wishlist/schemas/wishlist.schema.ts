import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WishlistDocument = Wishlist & Document;

@Schema({ timestamps: true })
export class Wishlist {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId })
  productId: Types.ObjectId;

  @Prop()
  productName: string;

  @Prop()
  productPrice: number;

  @Prop()
  productImage?: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);

// Indexes
WishlistSchema.index({ userId: 1, productId: 1 }, { unique: true });
WishlistSchema.index({ userId: 1 });
WishlistSchema.index({ createdAt: -1 });

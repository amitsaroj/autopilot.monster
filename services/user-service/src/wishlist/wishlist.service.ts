import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
  ) {}

  async addToWishlist(userId: string, productId: string, productData: any): Promise<Wishlist> {
    const existingItem = await this.wishlistModel.findOne({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
    });

    if (existingItem) {
      throw new ConflictException('Product already in wishlist');
    }

    const wishlistItem = new this.wishlistModel({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
      productName: productData.name,
      productPrice: productData.price,
      productImage: productData.image,
    });

    return wishlistItem.save();
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    const result = await this.wishlistModel.findOneAndDelete({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
    });

    if (!result) {
      throw new NotFoundException('Item not found in wishlist');
    }
  }

  async getUserWishlist(userId: string): Promise<Wishlist[]> {
    return this.wishlistModel.find({ userId: new Types.ObjectId(userId) }).sort({ createdAt: -1 }).exec();
  }

  async clearWishlist(userId: string): Promise<void> {
    await this.wishlistModel.deleteMany({ userId: new Types.ObjectId(userId) });
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const item = await this.wishlistModel.findOne({
      userId: new Types.ObjectId(userId),
      productId: new Types.ObjectId(productId),
    });

    return !!item;
  }
}

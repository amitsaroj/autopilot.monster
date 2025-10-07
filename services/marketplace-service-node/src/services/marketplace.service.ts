/**
 * Marketplace Service - Business Logic
 */

import { Product, IProduct } from '../models/product.model';
import { Category, ICategory } from '../models/category.model';
import { Review, IReview } from '../models/review.model';
import { publishMessage, KafkaTopic } from '../../../../shared/config/kafka';
import { cache } from '../../../../shared/config/redis';
import { logger } from '../../../../shared/config/logger';
import { v4 as uuidv4 } from 'uuid';

export class MarketplaceService {
  /**
   * Search products with filters
   */
  async searchProducts(filters: any = {}, page = 1, limit = 20): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const query: any = { status: 'active' };

      // Text search
      if (filters.search) {
        query.$text = { $search: filters.search };
      }

      // Category filter
      if (filters.category) {
        query.category = filters.category;
      }

      // Price range
      if (filters.minPrice || filters.maxPrice) {
        query.price = {};
        if (filters.minPrice) query.price.$gte = filters.minPrice;
        if (filters.maxPrice) query.price.$lte = filters.maxPrice;
      }

      // Rating filter
      if (filters.minRating) {
        query.rating = { $gte: filters.minRating };
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }

      // Vendor filter
      if (filters.vendorId) {
        query.vendorId = filters.vendorId;
      }

      // Featured/Popular
      if (filters.isFeatured === 'true') {
        query.isFeatured = true;
      }

      // Sort
      const sort: any = {};
      if (filters.sortBy === 'price_asc') sort.price = 1;
      else if (filters.sortBy === 'price_desc') sort.price = -1;
      else if (filters.sortBy === 'rating') sort.rating = -1;
      else if (filters.sortBy === 'popular') sort.downloadCount = -1;
      else sort.createdAt = -1;

      const [products, total] = await Promise.all([
        Product.find(query).sort(sort).skip(skip).limit(limit),
        Product.countDocuments(query),
      ]);

      return {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error searching products:', error);
      throw new Error('Failed to search products');
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(productId: string): Promise<IProduct | null> {
    try {
      // Check cache
      const cacheKey = `product:${productId}`;
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const product = await Product.findOne({ productId, status: 'active' });
      if (!product) {
        return null;
      }

      // Increment view count
      await Product.updateOne({ productId }, { $inc: { viewCount: 1 } });

      // Cache the result
      await cache.set(cacheKey, JSON.stringify(product), 300);

      return product;
    } catch (error) {
      logger.error('Error getting product:', error);
      throw new Error('Failed to get product');
    }
  }

  /**
   * Create product
   */
  async createProduct(data: Partial<IProduct>): Promise<IProduct> {
    try {
      const productId = `prod_${uuidv4()}`;
      const product = await Product.create({
        ...data,
        productId,
        rating: 0,
        reviewCount: 0,
        downloadCount: 0,
        viewCount: 0,
      });

      // Publish event
      await publishMessage(KafkaTopic.PRODUCT_CREATED, {
        productId,
        name: product.name,
        vendorId: product.vendorId,
        timestamp: new Date().toISOString(),
      });

      return product;
    } catch (error) {
      logger.error('Error creating product:', error);
      throw new Error('Failed to create product');
    }
  }

  /**
   * Update product
   */
  async updateProduct(productId: string, updates: Partial<IProduct>): Promise<IProduct | null> {
    try {
      const product = await Product.findOneAndUpdate(
        { productId },
        { $set: updates },
        { new: true }
      );

      if (product) {
        // Clear cache
        await cache.del(`product:${productId}`);

        // Publish event
        await publishMessage(KafkaTopic.PRODUCT_UPDATED, {
          productId,
          updates,
          timestamp: new Date().toISOString(),
        });
      }

      return product;
    } catch (error) {
      logger.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  /**
   * Delete product
   */
  async deleteProduct(productId: string): Promise<boolean> {
    try {
      const result = await Product.updateOne(
        { productId },
        { status: 'archived' }
      );

      if (result.modifiedCount > 0) {
        await cache.del(`product:${productId}`);

        await publishMessage(KafkaTopic.PRODUCT_DELETED, {
          productId,
          timestamp: new Date().toISOString(),
        });

        return true;
      }

      return false;
    } catch (error) {
      logger.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }

  /**
   * Get categories
   */
  async getCategories(): Promise<ICategory[]> {
    try {
      const cacheKey = 'categories:all';
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const categories = await Category.find({ isActive: true }).sort({ order: 1 });

      // Cache for 1 hour
      await cache.set(cacheKey, JSON.stringify(categories), 3600);

      return categories;
    } catch (error) {
      logger.error('Error getting categories:', error);
      throw new Error('Failed to get categories');
    }
  }

  /**
   * Get product reviews
   */
  async getProductReviews(productId: string, page = 1, limit = 10): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        Review.find({ productId, status: 'approved' })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Review.countDocuments({ productId, status: 'approved' }),
      ]);

      return {
        reviews,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting reviews:', error);
      throw new Error('Failed to get reviews');
    }
  }

  /**
   * Create review
   */
  async createReview(data: Partial<IReview>): Promise<IReview> {
    try {
      const reviewId = `rev_${uuidv4()}`;
      const review = await Review.create({
        ...data,
        reviewId,
        status: 'pending',
        helpfulCount: 0,
        unhelpfulCount: 0,
      });

      // Update product rating
      await this.updateProductRating(data.productId as string);

      // Publish event
      await publishMessage(KafkaTopic.REVIEW_CREATED, {
        reviewId,
        productId: data.productId,
        rating: data.rating,
        timestamp: new Date().toISOString(),
      });

      return review;
    } catch (error) {
      logger.error('Error creating review:', error);
      throw new Error('Failed to create review');
    }
  }

  /**
   * Update product rating based on reviews
   */
  private async updateProductRating(productId: string): Promise<void> {
    try {
      const reviews = await Review.find({ productId, status: 'approved' });
      
      if (reviews.length === 0) {
        await Product.updateOne(
          { productId },
          { rating: 0, reviewCount: 0 }
        );
        return;
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRating / reviews.length;

      await Product.updateOne(
        { productId },
        {
          rating: parseFloat(avgRating.toFixed(1)),
          reviewCount: reviews.length,
        }
      );

      // Clear product cache
      await cache.del(`product:${productId}`);
    } catch (error) {
      logger.error('Error updating product rating:', error);
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit = 10): Promise<IProduct[]> {
    try {
      const cacheKey = `products:featured:${limit}`;
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const products = await Product.find({
        status: 'active',
        isFeatured: true,
      })
        .sort({ rating: -1 })
        .limit(limit);

      // Cache for 15 minutes
      await cache.set(cacheKey, JSON.stringify(products), 900);

      return products;
    } catch (error) {
      logger.error('Error getting featured products:', error);
      throw new Error('Failed to get featured products');
    }
  }

  /**
   * Get popular products
   */
  async getPopularProducts(limit = 10): Promise<IProduct[]> {
    try {
      const cacheKey = `products:popular:${limit}`;
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const products = await Product.find({
        status: 'active',
      })
        .sort({ downloadCount: -1, rating: -1 })
        .limit(limit);

      // Cache for 15 minutes
      await cache.set(cacheKey, JSON.stringify(products), 900);

      return products;
    } catch (error) {
      logger.error('Error getting popular products:', error);
      throw new Error('Failed to get popular products');
    }
  }
}

export const marketplaceService = new MarketplaceService();


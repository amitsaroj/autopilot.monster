/**
 * Marketplace Controller
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { marketplaceService } from '../services/marketplace.service';
import { sendSuccess, sendError } from '../../../../shared/utils/response.util';
import { logger } from '../../../../shared/config/logger';

export class MarketplaceController {
  async searchProducts(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { search, category, minPrice, maxPrice, minRating, tags, sortBy, page = 1, limit = 20 } = req.query as any;
      
      const result = await marketplaceService.searchProducts(
        { search, category, minPrice, maxPrice, minRating, tags, sortBy },
        parseInt(page),
        parseInt(limit)
      );

      return sendSuccess(reply, result, 'Products retrieved successfully');
    } catch (error: any) {
      logger.error('Error in searchProducts:', error);
      return sendError(reply, error.message);
    }
  }

  async getProduct(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { productId } = req.params as { productId: string };
      
      const product = await marketplaceService.getProductById(productId);
      if (!product) {
        return sendError(reply, 'Product not found', 404);
      }

      return sendSuccess(reply, product, 'Product retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getProduct:', error);
      return sendError(reply, error.message);
    }
  }

  async createProduct(req: any, reply: FastifyReply) {
    try {
      const vendorId = req.user?.userId;
      if (!vendorId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const productData = { ...req.body, vendorId };
      const product = await marketplaceService.createProduct(productData);

      return sendSuccess(reply, product, 'Product created successfully', 201);
    } catch (error: any) {
      logger.error('Error in createProduct:', error);
      return sendError(reply, error.message);
    }
  }

  async updateProduct(req: any, reply: FastifyReply) {
    try {
      const vendorId = req.user?.userId;
      if (!vendorId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const { productId } = req.params as { productId: string };
      const updates = req.body;

      const product = await marketplaceService.updateProduct(productId, updates);
      if (!product) {
        return sendError(reply, 'Product not found', 404);
      }

      return sendSuccess(reply, product, 'Product updated successfully');
    } catch (error: any) {
      logger.error('Error in updateProduct:', error);
      return sendError(reply, error.message);
    }
  }

  async deleteProduct(req: any, reply: FastifyReply) {
    try {
      const vendorId = req.user?.userId;
      if (!vendorId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const { productId } = req.params as { productId: string };
      const deleted = await marketplaceService.deleteProduct(productId);

      if (!deleted) {
        return sendError(reply, 'Product not found', 404);
      }

      return sendSuccess(reply, null, 'Product deleted successfully');
    } catch (error: any) {
      logger.error('Error in deleteProduct:', error);
      return sendError(reply, error.message);
    }
  }

  async getCategories(req: FastifyRequest, reply: FastifyReply) {
    try {
      const categories = await marketplaceService.getCategories();
      return sendSuccess(reply, categories, 'Categories retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getCategories:', error);
      return sendError(reply, error.message);
    }
  }

  async getFeaturedProducts(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { limit = 10 } = req.query as any;
      const products = await marketplaceService.getFeaturedProducts(parseInt(limit));
      return sendSuccess(reply, products, 'Featured products retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getFeaturedProducts:', error);
      return sendError(reply, error.message);
    }
  }

  async getPopularProducts(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { limit = 10 } = req.query as any;
      const products = await marketplaceService.getPopularProducts(parseInt(limit));
      return sendSuccess(reply, products, 'Popular products retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getPopularProducts:', error);
      return sendError(reply, error.message);
    }
  }

  async getProductReviews(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { productId } = req.params as { productId: string };
      const { page = 1, limit = 10 } = req.query as any;

      const result = await marketplaceService.getProductReviews(productId, parseInt(page), parseInt(limit));
      return sendSuccess(reply, result, 'Reviews retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getProductReviews:', error);
      return sendError(reply, error.message);
    }
  }

  async createReview(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const reviewData = { ...req.body, userId };
      const review = await marketplaceService.createReview(reviewData);

      return sendSuccess(reply, review, 'Review submitted successfully', 201);
    } catch (error: any) {
      logger.error('Error in createReview:', error);
      return sendError(reply, error.message);
    }
  }
}

export const marketplaceController = new MarketplaceController();


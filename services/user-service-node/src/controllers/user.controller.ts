/**
 * User Controller - Request Handlers
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from '../services/user.service';
import { sendSuccess, sendError } from '../../../../shared/utils/response.util';
import { logger } from '../../../../shared/config/logger';

export class UserController {
  /**
   * Get user profile
   */
  async getProfile(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const profile = await userService.getProfile(userId);
      if (!profile) {
        return sendError(reply, 'Profile not found', 404);
      }

      return sendSuccess(reply, profile, 'Profile retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getProfile:', error);
      return sendError(reply, error.message);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const updates = req.body;
      const profile = await userService.updateProfile(userId, updates);
      
      if (!profile) {
        return sendError(reply, 'Profile not found', 404);
      }

      return sendSuccess(reply, profile, 'Profile updated successfully');
    } catch (error: any) {
      logger.error('Error in updateProfile:', error);
      return sendError(reply, error.message);
    }
  }

  /**
   * Get user dashboard
   */
  async getDashboard(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const stats = await userService.getDashboardStats(userId);
      return sendSuccess(reply, stats, 'Dashboard data retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getDashboard:', error);
      return sendError(reply, error.message);
    }
  }

  /**
   * Get wishlist
   */
  async getWishlist(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const wishlist = await userService.getWishlist(userId);
      return sendSuccess(reply, wishlist, 'Wishlist retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getWishlist:', error);
      return sendError(reply, error.message);
    }
  }

  /**
   * Add to wishlist
   */
  async addToWishlist(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const { productId, productName, productPrice } = req.body;
      if (!productId || !productName || !productPrice) {
        return sendError(reply, 'Missing required fields', 400);
      }

      const wishlist = await userService.addToWishlist(userId, productId, productName, productPrice);
      return sendSuccess(reply, wishlist, 'Item added to wishlist');
    } catch (error: any) {
      logger.error('Error in addToWishlist:', error);
      return sendError(reply, error.message);
    }
  }

  /**
   * Remove from wishlist
   */
  async removeFromWishlist(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const { productId } = req.params as { productId: string };
      const wishlist = await userService.removeFromWishlist(userId, productId);
      return sendSuccess(reply, wishlist, 'Item removed from wishlist');
    } catch (error: any) {
      logger.error('Error in removeFromWishlist:', error);
      return sendError(reply, error.message);
    }
  }

  /**
   * Get subscriptions
   */
  async getSubscriptions(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const subscriptions = await userService.getSubscriptions(userId);
      return sendSuccess(reply, subscriptions, 'Subscriptions retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getSubscriptions:', error);
      return sendError(reply, error.message);
    }
  }

  /**
   * Get active subscription
   */
  async getActiveSubscription(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const subscription = await userService.getActiveSubscription(userId);
      return sendSuccess(reply, subscription, 'Active subscription retrieved');
    } catch (error: any) {
      logger.error('Error in getActiveSubscription:', error);
      return sendError(reply, error.message);
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const { subscriptionId } = req.params as { subscriptionId: string };
      const subscription = await userService.cancelSubscription(subscriptionId);
      
      if (!subscription) {
        return sendError(reply, 'Subscription not found', 404);
      }

      return sendSuccess(reply, subscription, 'Subscription cancelled successfully');
    } catch (error: any) {
      logger.error('Error in cancelSubscription:', error);
      return sendError(reply, error.message);
    }
  }
}

export const userController = new UserController();


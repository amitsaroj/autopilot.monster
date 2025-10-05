/**
 * Cart Controller
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { cartService } from '../services/cart.service';
import { sendSuccess, sendError } from '../../../../shared/utils/response.util';
import { logger } from '../../../../shared/config/logger';

export class CartController {
  async getCart(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const cart = await cartService.getCart(userId);
      return sendSuccess(reply, cart, 'Cart retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getCart:', error);
      return sendError(reply, error.message);
    }
  }

  async addItem(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const item = req.body;
      const cart = await cartService.addItem(userId, item);
      return sendSuccess(reply, cart, 'Item added to cart');
    } catch (error: any) {
      logger.error('Error in addItem:', error);
      return sendError(reply, error.message);
    }
  }

  async updateItem(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const { productId } = req.params;
      const { quantity } = req.body;

      const cart = await cartService.updateItemQuantity(userId, productId, quantity);
      return sendSuccess(reply, cart, 'Cart updated successfully');
    } catch (error: any) {
      logger.error('Error in updateItem:', error);
      return sendError(reply, error.message);
    }
  }

  async removeItem(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const { productId } = req.params;
      const cart = await cartService.removeItem(userId, productId);
      return sendSuccess(reply, cart, 'Item removed from cart');
    } catch (error: any) {
      logger.error('Error in removeItem:', error);
      return sendError(reply, error.message);
    }
  }

  async clearCart(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      await cartService.clearCart(userId);
      return sendSuccess(reply, null, 'Cart cleared successfully');
    } catch (error: any) {
      logger.error('Error in clearCart:', error);
      return sendError(reply, error.message);
    }
  }

  async applyCoupon(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const { couponCode } = req.body;
      const cart = await cartService.applyCoupon(userId, couponCode);
      return sendSuccess(reply, cart, 'Coupon applied successfully');
    } catch (error: any) {
      logger.error('Error in applyCoupon:', error);
      return sendError(reply, error.message);
    }
  }

  async removeCoupon(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const cart = await cartService.removeCoupon(userId);
      return sendSuccess(reply, cart, 'Coupon removed successfully');
    } catch (error: any) {
      logger.error('Error in removeCoupon:', error);
      return sendError(reply, error.message);
    }
  }
}

export const cartController = new CartController();


/**
 * Order Controller
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { orderService } from '../services/order.service';
import { sendSuccess, sendError } from '../../../../shared/utils/response.util';
import { logger } from '../../../../shared/config/logger';

export class OrderController {
  async createOrder(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      const userEmail = req.user?.email;

      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const order = await orderService.createOrder(userId, userEmail, req.body);
      return sendSuccess(reply, order, 'Order created successfully', 201);
    } catch (error: any) {
      logger.error('Error in createOrder:', error);
      return sendError(reply, error.message);
    }
  }

  async getOrder(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      const { orderId } = req.params;

      const order = await orderService.getOrderById(orderId, userId);
      if (!order) {
        return sendError(reply, 'Order not found', 404);
      }

      return sendSuccess(reply, order, 'Order retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getOrder:', error);
      return sendError(reply, error.message);
    }
  }

  async getUserOrders(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const { page = 1, limit = 20 } = req.query as any;
      const result = await orderService.getUserOrders(userId, parseInt(page), parseInt(limit));

      return sendSuccess(reply, result, 'Orders retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getUserOrders:', error);
      return sendError(reply, error.message);
    }
  }

  async cancelOrder(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const { orderId } = req.params;
      const order = await orderService.cancelOrder(orderId, userId);

      if (!order) {
        return sendError(reply, 'Order not found', 404);
      }

      return sendSuccess(reply, order, 'Order cancelled successfully');
    } catch (error: any) {
      logger.error('Error in cancelOrder:', error);
      return sendError(reply, error.message);
    }
  }

  async processPayment(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const { orderId } = req.params;
      const paymentData = { ...req.body, userId };

      const payment = await orderService.processPayment(orderId, paymentData);
      return sendSuccess(reply, payment, 'Payment processing initiated', 201);
    } catch (error: any) {
      logger.error('Error in processPayment:', error);
      return sendError(reply, error.message);
    }
  }

  async getPayment(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { orderId } = req.params as any;
      const payment = await orderService.getPaymentByOrderId(orderId);

      if (!payment) {
        return sendError(reply, 'Payment not found', 404);
      }

      return sendSuccess(reply, payment, 'Payment retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getPayment:', error);
      return sendError(reply, error.message);
    }
  }

  async getOrderStats(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      const stats = await orderService.getOrderStats(userId);

      return sendSuccess(reply, stats, 'Order stats retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getOrderStats:', error);
      return sendError(reply, error.message);
    }
  }
}

export const orderController = new OrderController();



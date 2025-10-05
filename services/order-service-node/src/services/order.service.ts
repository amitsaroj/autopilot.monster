/**
 * Order Service - Business Logic
 */

import { Order, IOrder } from '../models/order.model';
import { Payment, IPayment } from '../models/payment.model';
import { publishMessage, KafkaTopic } from '../../../../shared/config/kafka';
import { cache } from '../../../../shared/config/redis';
import { logger } from '../../../../shared/config/logger';
import { v4 as uuidv4 } from 'uuid';

export class OrderService {
  /**
   * Create order from cart
   */
  async createOrder(userId: string, userEmail: string, orderData: any): Promise<IOrder> {
    try {
      const orderId = `order_${uuidv4()}`;

      const order = await Order.create({
        orderId,
        userId,
        userEmail,
        ...orderData,
        status: 'pending',
        paymentStatus: 'pending',
      });

      // Publish event
      await publishMessage(KafkaTopic.ORDER_CREATED, {
        orderId,
        userId,
        total: order.total,
        timestamp: new Date().toISOString(),
      });

      return order;
    } catch (error) {
      logger.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string, userId?: string): Promise<IOrder | null> {
    try {
      const query: any = { orderId };
      if (userId) {
        query.userId = userId;
      }

      const order = await Order.findOne(query);
      return order;
    } catch (error) {
      logger.error('Error getting order:', error);
      throw new Error('Failed to get order');
    }
  }

  /**
   * Get user orders
   */
  async getUserOrders(userId: string, page = 1, limit = 20): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        Order.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Order.countDocuments({ userId }),
      ]);

      return {
        orders,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting user orders:', error);
      throw new Error('Failed to get user orders');
    }
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string): Promise<IOrder | null> {
    try {
      const order = await Order.findOneAndUpdate(
        { orderId },
        { status },
        { new: true }
      );

      if (order) {
        // Publish event
        await publishMessage(KafkaTopic.ORDER_STATUS_UPDATED, {
          orderId,
          status,
          userId: order.userId,
          timestamp: new Date().toISOString(),
        });
      }

      return order;
    } catch (error) {
      logger.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string, userId: string): Promise<IOrder | null> {
    try {
      const order = await Order.findOne({ orderId, userId });

      if (!order) {
        return null;
      }

      if (order.status !== 'pending' && order.status !== 'processing') {
        throw new Error('Cannot cancel order in current status');
      }

      order.status = 'cancelled';
      await order.save();

      // Publish event
      await publishMessage(KafkaTopic.ORDER_CANCELLED, {
        orderId,
        userId,
        timestamp: new Date().toISOString(),
      });

      return order;
    } catch (error) {
      logger.error('Error cancelling order:', error);
      throw error;
    }
  }

  /**
   * Process payment
   */
  async processPayment(orderId: string, paymentData: any): Promise<IPayment> {
    try {
      const paymentId = `pay_${uuidv4()}`;

      const payment = await Payment.create({
        paymentId,
        orderId,
        ...paymentData,
        status: 'processing',
      });

      // Simulate payment processing (in real app, call payment gateway)
      setTimeout(async () => {
        try {
          // Update payment status
          payment.status = 'completed';
          payment.transactionId = `txn_${uuidv4()}`;
          await payment.save();

          // Update order payment status
          await Order.updateOne(
            { orderId },
            { paymentStatus: 'paid', status: 'processing', paymentId }
          );

          // Publish event
          await publishMessage(KafkaTopic.PAYMENT_COMPLETED, {
            paymentId,
            orderId,
            amount: payment.amount,
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          logger.error('Error in payment processing callback:', error);
        }
      }, 2000);

      return payment;
    } catch (error) {
      logger.error('Error processing payment:', error);
      throw new Error('Failed to process payment');
    }
  }

  /**
   * Get payment by order ID
   */
  async getPaymentByOrderId(orderId: string): Promise<IPayment | null> {
    try {
      const payment = await Payment.findOne({ orderId });
      return payment;
    } catch (error) {
      logger.error('Error getting payment:', error);
      throw new Error('Failed to get payment');
    }
  }

  /**
   * Refund order
   */
  async refundOrder(orderId: string, refundReason: string): Promise<IOrder | null> {
    try {
      const order = await Order.findOne({ orderId });

      if (!order) {
        return null;
      }

      if (order.paymentStatus !== 'paid') {
        throw new Error('Cannot refund unpaid order');
      }

      // Update order
      order.status = 'refunded';
      order.paymentStatus = 'refunded';
      await order.save();

      // Update payment
      await Payment.updateOne(
        { orderId },
        {
          status: 'refunded',
          refundAmount: order.total,
          refundReason,
          refundedAt: new Date(),
        }
      );

      // Publish event
      await publishMessage(KafkaTopic.ORDER_REFUNDED, {
        orderId,
        userId: order.userId,
        amount: order.total,
        timestamp: new Date().toISOString(),
      });

      return order;
    } catch (error) {
      logger.error('Error refunding order:', error);
      throw error;
    }
  }

  /**
   * Get order statistics
   */
  async getOrderStats(userId?: string): Promise<any> {
    try {
      const match: any = {};
      if (userId) {
        match.userId = userId;
      }

      const stats = await Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$total' },
          },
        },
      ]);

      return stats;
    } catch (error) {
      logger.error('Error getting order stats:', error);
      throw new Error('Failed to get order stats');
    }
  }
}

export const orderService = new OrderService();



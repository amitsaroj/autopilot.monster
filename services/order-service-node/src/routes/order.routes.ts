/**
 * Order Routes
 */

import { FastifyInstance } from 'fastify';
import { orderController } from '../controllers/order.controller';
import { authenticate } from '../../../../shared/middleware/auth.middleware';

export default async function orderRoutes(app: FastifyInstance) {
  // Create order
  app.post('/orders', {
    preHandler: authenticate,
    schema: {
      description: 'Create new order',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['items', 'total', 'paymentMethod'],
        properties: {
          items: { type: 'array' },
          subtotal: { type: 'number' },
          discount: { type: 'number' },
          tax: { type: 'number' },
          total: { type: 'number' },
          paymentMethod: { type: 'string' },
          shippingAddress: { type: 'object' },
          billingAddress: { type: 'object' },
        },
      },
    },
  }, orderController.createOrder.bind(orderController));

  // Get user orders
  app.get('/orders', {
    preHandler: authenticate,
    schema: {
      description: 'Get user orders',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 },
        },
      },
    },
  }, orderController.getUserOrders.bind(orderController));

  // Get order by ID
  app.get('/orders/:orderId', {
    preHandler: authenticate,
    schema: {
      description: 'Get order by ID',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          orderId: { type: 'string' },
        },
      },
    },
  }, orderController.getOrder.bind(orderController));

  // Cancel order
  app.post('/orders/:orderId/cancel', {
    preHandler: authenticate,
    schema: {
      description: 'Cancel order',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          orderId: { type: 'string' },
        },
      },
    },
  }, orderController.cancelOrder.bind(orderController));

  // Process payment
  app.post('/orders/:orderId/payment', {
    preHandler: authenticate,
    schema: {
      description: 'Process payment for order',
      tags: ['Payments'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          orderId: { type: 'string' },
        },
      },
      body: {
        type: 'object',
        required: ['amount', 'method'],
        properties: {
          amount: { type: 'number' },
          method: { type: 'string', enum: ['card', 'paypal', 'stripe', 'bank_transfer', 'wallet'] },
        },
      },
    },
  }, orderController.processPayment.bind(orderController));

  // Get payment status
  app.get('/orders/:orderId/payment', {
    schema: {
      description: 'Get payment status for order',
      tags: ['Payments'],
      params: {
        type: 'object',
        properties: {
          orderId: { type: 'string' },
        },
      },
    },
  }, orderController.getPayment.bind(orderController));

  // Get order statistics
  app.get('/stats', {
    preHandler: authenticate,
    schema: {
      description: 'Get order statistics',
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
    },
  }, orderController.getOrderStats.bind(orderController));
}



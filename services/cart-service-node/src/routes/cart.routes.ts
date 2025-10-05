/**
 * Cart Routes
 */

import { FastifyInstance } from 'fastify';
import { cartController } from '../controllers/cart.controller';
import { authenticate } from '../../../../shared/middleware/auth.middleware';

export default async function cartRoutes(app: FastifyInstance) {
  // Get cart
  app.get('/', {
    preHandler: authenticate,
    schema: {
      description: 'Get user cart',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
    },
  }, cartController.getCart.bind(cartController));

  // Add item to cart
  app.post('/items', {
    preHandler: authenticate,
    schema: {
      description: 'Add item to cart',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['productId', 'productName', 'price', 'quantity', 'vendorId'],
        properties: {
          productId: { type: 'string' },
          productName: { type: 'string' },
          price: { type: 'number' },
          quantity: { type: 'number', minimum: 1 },
          thumbnail: { type: 'string' },
          vendorId: { type: 'string' },
        },
      },
    },
  }, cartController.addItem.bind(cartController));

  // Update cart item quantity
  app.put('/items/:productId', {
    preHandler: authenticate,
    schema: {
      description: 'Update cart item quantity',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
        },
      },
      body: {
        type: 'object',
        required: ['quantity'],
        properties: {
          quantity: { type: 'number', minimum: 0 },
        },
      },
    },
  }, cartController.updateItem.bind(cartController));

  // Remove item from cart
  app.delete('/items/:productId', {
    preHandler: authenticate,
    schema: {
      description: 'Remove item from cart',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
        },
      },
    },
  }, cartController.removeItem.bind(cartController));

  // Clear cart
  app.delete('/', {
    preHandler: authenticate,
    schema: {
      description: 'Clear cart',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
    },
  }, cartController.clearCart.bind(cartController));

  // Apply coupon
  app.post('/coupon', {
    preHandler: authenticate,
    schema: {
      description: 'Apply coupon code',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['couponCode'],
        properties: {
          couponCode: { type: 'string' },
        },
      },
    },
  }, cartController.applyCoupon.bind(cartController));

  // Remove coupon
  app.delete('/coupon', {
    preHandler: authenticate,
    schema: {
      description: 'Remove coupon code',
      tags: ['Cart'],
      security: [{ bearerAuth: [] }],
    },
  }, cartController.removeCoupon.bind(cartController));
}


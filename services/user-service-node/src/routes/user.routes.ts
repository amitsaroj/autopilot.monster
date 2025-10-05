/**
 * User Routes
 */

import { FastifyInstance } from 'fastify';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../../../../shared/middleware/auth.middleware';

export default async function userRoutes(app: FastifyInstance) {
  // Get user profile
  app.get(
    '/profile',
    {
      preHandler: authenticate,
      schema: {
        description: 'Get user profile',
        tags: ['User'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: 'Successful response',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: { type: 'object' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    userController.getProfile.bind(userController)
  );

  // Update user profile
  app.put(
    '/profile',
    {
      preHandler: authenticate,
      schema: {
        description: 'Update user profile',
        tags: ['User'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            bio: { type: 'string' },
            location: { type: 'string' },
            avatar: { type: 'string' },
          },
        },
      },
    },
    userController.updateProfile.bind(userController)
  );

  // Get dashboard
  app.get(
    '/dashboard',
    {
      preHandler: authenticate,
      schema: {
        description: 'Get user dashboard stats',
        tags: ['User'],
        security: [{ bearerAuth: [] }],
      },
    },
    userController.getDashboard.bind(userController)
  );

  // Get wishlist
  app.get(
    '/wishlist',
    {
      preHandler: authenticate,
      schema: {
        description: 'Get user wishlist',
        tags: ['Wishlist'],
        security: [{ bearerAuth: [] }],
      },
    },
    userController.getWishlist.bind(userController)
  );

  // Add to wishlist
  app.post(
    '/wishlist',
    {
      preHandler: authenticate,
      schema: {
        description: 'Add item to wishlist',
        tags: ['Wishlist'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['productId', 'productName', 'productPrice'],
          properties: {
            productId: { type: 'string' },
            productName: { type: 'string' },
            productPrice: { type: 'number' },
          },
        },
      },
    },
    userController.addToWishlist.bind(userController)
  );

  // Remove from wishlist
  app.delete(
    '/wishlist/:productId',
    {
      preHandler: authenticate,
      schema: {
        description: 'Remove item from wishlist',
        tags: ['Wishlist'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
          },
        },
      },
    },
    userController.removeFromWishlist.bind(userController)
  );

  // Get subscriptions
  app.get(
    '/subscriptions',
    {
      preHandler: authenticate,
      schema: {
        description: 'Get user subscriptions',
        tags: ['Subscriptions'],
        security: [{ bearerAuth: [] }],
      },
    },
    userController.getSubscriptions.bind(userController)
  );

  // Get active subscription
  app.get(
    '/subscriptions/active',
    {
      preHandler: authenticate,
      schema: {
        description: 'Get active subscription',
        tags: ['Subscriptions'],
        security: [{ bearerAuth: [] }],
      },
    },
    userController.getActiveSubscription.bind(userController)
  );

  // Cancel subscription
  app.post(
    '/subscriptions/:subscriptionId/cancel',
    {
      preHandler: authenticate,
      schema: {
        description: 'Cancel subscription',
        tags: ['Subscriptions'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            subscriptionId: { type: 'string' },
          },
        },
      },
    },
    userController.cancelSubscription.bind(userController)
  );
}


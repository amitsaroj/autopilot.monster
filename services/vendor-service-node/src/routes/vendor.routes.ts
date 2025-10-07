/**
 * Vendor Routes
 */

import { FastifyInstance } from 'fastify';
import { vendorController } from '../controllers/vendor.controller';
import { authenticate } from '../../../../shared/middleware/auth.middleware';

export default async function vendorRoutes(app: FastifyInstance) {
  // Register as vendor
  app.post('/register', {
    preHandler: authenticate,
    schema: {
      description: 'Register as vendor',
      tags: ['Vendor'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['businessName', 'email', 'category'],
        properties: {
          businessName: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          website: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
        },
      },
    },
  }, vendorController.registerVendor.bind(vendorController));

  // Get vendor profile
  app.get('/profile', {
    preHandler: authenticate,
    schema: {
      description: 'Get vendor profile',
      tags: ['Vendor'],
      security: [{ bearerAuth: [] }],
    },
  }, vendorController.getVendor.bind(vendorController));

  // Update vendor profile
  app.put('/profile', {
    preHandler: authenticate,
    schema: {
      description: 'Update vendor profile',
      tags: ['Vendor'],
      security: [{ bearerAuth: [] }],
    },
  }, vendorController.updateVendor.bind(vendorController));

  // Get dashboard stats
  app.get('/dashboard', {
    preHandler: authenticate,
    schema: {
      description: 'Get vendor dashboard stats',
      tags: ['Vendor'],
      security: [{ bearerAuth: [] }],
    },
  }, vendorController.getDashboard.bind(vendorController));

  // Get analytics
  app.get('/analytics', {
    preHandler: authenticate,
    schema: {
      description: 'Get vendor analytics',
      tags: ['Vendor'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['7d', '30d', '90d', '1y'] },
        },
      },
    },
  }, vendorController.getAnalytics.bind(vendorController));

  // Request payout
  app.post('/payouts', {
    preHandler: authenticate,
    schema: {
      description: 'Request payout',
      tags: ['Vendor'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['amount', 'method'],
        properties: {
          amount: { type: 'number' },
          method: { type: 'string', enum: ['bank_transfer', 'paypal', 'stripe'] },
        },
      },
    },
  }, vendorController.requestPayout.bind(vendorController));

  // Get payouts
  app.get('/payouts', {
    preHandler: authenticate,
    schema: {
      description: 'Get vendor payouts',
      tags: ['Vendor'],
      security: [{ bearerAuth: [] }],
    },
  }, vendorController.getPayouts.bind(vendorController));
}

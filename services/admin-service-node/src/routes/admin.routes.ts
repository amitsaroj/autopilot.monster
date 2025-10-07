/**
 * Admin Routes
 */

import { FastifyInstance } from 'fastify';
import { adminController } from '../controllers/admin.controller';
import { authenticate } from '../../../../shared/middleware/auth.middleware';

export default async function adminRoutes(app: FastifyInstance) {
  // Get dashboard stats
  app.get('/dashboard', {
    preHandler: authenticate,
    schema: {
      description: 'Get admin dashboard stats',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
    },
  }, adminController.getDashboard.bind(adminController));

  // Get pending approvals
  app.get('/approvals', {
    preHandler: authenticate,
    schema: {
      description: 'Get pending approvals',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['vendor', 'product', 'blog', 'tutorial', 'review'] },
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 },
        },
      },
    },
  }, adminController.getApprovals.bind(adminController));

  // Approve item
  app.post('/approvals/:approvalId/approve', {
    preHandler: authenticate,
    schema: {
      description: 'Approve item',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          approvalId: { type: 'string' },
        },
      },
      body: {
        type: 'object',
        properties: {
          comments: { type: 'string' },
        },
      },
    },
  }, adminController.approveItem.bind(adminController));

  // Reject item
  app.post('/approvals/:approvalId/reject', {
    preHandler: authenticate,
    schema: {
      description: 'Reject item',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          approvalId: { type: 'string' },
        },
      },
      body: {
        type: 'object',
        required: ['comments'],
        properties: {
          comments: { type: 'string' },
        },
      },
    },
  }, adminController.rejectItem.bind(adminController));

  // Get system analytics
  app.get('/analytics', {
    preHandler: authenticate,
    schema: {
      description: 'Get system analytics',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          period: { type: 'string', enum: ['7d', '30d', '90d', '1y'] },
        },
      },
    },
  }, adminController.getAnalytics.bind(adminController));

  // Get all users
  app.get('/users', {
    preHandler: authenticate,
    schema: {
      description: 'Get all users',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 },
        },
      },
    },
  }, adminController.getUsers.bind(adminController));

  // Update user status
  app.put('/users/:userId/status', {
    preHandler: authenticate,
    schema: {
      description: 'Update user status',
      tags: ['Admin'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
        },
      },
      body: {
        type: 'object',
        required: ['status'],
        properties: {
          status: { type: 'string', enum: ['active', 'suspended', 'banned'] },
        },
      },
    },
  }, adminController.updateUserStatus.bind(adminController));
}

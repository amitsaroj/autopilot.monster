/**
 * Auth Routes
 * API routes for authentication endpoints
 */

import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller';

// Import authentication middleware adapter for Fastify
const authenticateAdapter = async (request: any, reply: any) => {
  const { authenticate } = await import('../../../../shared/middleware/auth.middleware');
  
  return new Promise((resolve, reject) => {
    authenticate(request as any, reply as any, (err?: any) => {
      if (err) reject(err);
      else resolve(undefined);
    });
  });
};

export default async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController();

  // Swagger schemas
  const registerSchema = {
    schema: {
      description: 'Register a new user',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email', 'password', 'firstName', 'lastName'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          company: { type: 'string' },
          phone: { type: 'string' },
        },
      },
      response: {
        201: {
          description: 'User registered successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                user: { type: 'object' },
                tokens: { type: 'object' },
              },
            },
            message: { type: 'string' },
          },
        },
      },
    },
  };

  const loginSchema = {
    schema: {
      description: 'Login user',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      response: {
        200: {
          description: 'Login successful',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                user: { type: 'object' },
                tokens: { type: 'object' },
              },
            },
          },
        },
      },
    },
  };

  const refreshTokenSchema = {
    schema: {
      description: 'Refresh access token',
      tags: ['Authentication'],
      body: {
        type: 'object',
        required: ['refreshToken'],
        properties: {
          refreshToken: { type: 'string' },
        },
      },
    },
  };

  const profileSchema = {
    schema: {
      description: 'Get user profile',
      tags: ['Authentication'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Profile retrieved successfully',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
          },
        },
      },
    },
  };

  // Routes
  app.post('/register', registerSchema, controller.register);
  app.post('/login', loginSchema, controller.login);
  app.post('/refresh', refreshTokenSchema, controller.refreshToken);
  app.post('/logout', { preHandler: [authenticateAdapter] }, controller.logout);
  app.get('/profile', { ...profileSchema, preHandler: [authenticateAdapter] }, controller.getProfile);
  app.post('/password-reset/request', controller.requestPasswordReset);
  app.post('/password-reset/confirm', controller.resetPassword);
  app.post('/verify-email', controller.verifyEmail);
}


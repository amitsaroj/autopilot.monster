/**
 * Auth Controller
 * HTTP request handlers for authentication endpoints
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendCreated } from '../../../../shared/utils/response.util';
import { logger } from '../../../../shared/config/logger';
import { createError } from '../../../../shared/middleware/error.middleware';

interface RegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  phone?: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface RefreshTokenBody {
  refreshToken: string;
}

interface LogoutBody {
  refreshToken: string;
}

interface PasswordResetRequestBody {
  email: string;
}

interface PasswordResetBody {
  token: string;
  newPassword: string;
}

interface EmailVerificationBody {
  token: string;
}

interface AuthRequest extends FastifyRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register new user
   */
  register = async (req: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
    try {
      const { email, password, firstName, lastName, company, phone } = req.body;

      // Validation
      if (!email || !password || !firstName || !lastName) {
        throw createError.badRequest('Email, password, first name, and last name are required');
      }

      if (password.length < 8) {
        throw createError.badRequest('Password must be at least 8 characters long');
      }

      const result = await this.authService.register({
        email,
        password,
        firstName,
        lastName,
        company,
        phone,
      });

      return sendCreated(reply, result, 'User registered successfully');
    } catch (error: any) {
      logger.error('Register controller error:', error);
      return reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message || 'Registration failed',
        statusCode: error.statusCode || 500,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Login user
   */
  login = async (req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        throw createError.badRequest('Email and password are required');
      }

      const result = await this.authService.login(email, password);

      return sendSuccess(reply, result, 'Login successful');
    } catch (error: any) {
      logger.error('Login controller error:', error);
      return reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message || 'Login failed',
        statusCode: error.statusCode || 500,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Refresh access token
   */
  refreshToken = async (req: FastifyRequest<{ Body: RefreshTokenBody }>, reply: FastifyReply) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw createError.badRequest('Refresh token is required');
      }

      const result = await this.authService.refreshToken(refreshToken);

      return sendSuccess(reply, result, 'Token refreshed successfully');
    } catch (error: any) {
      logger.error('Refresh token controller error:', error);
      return reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message || 'Token refresh failed',
        statusCode: error.statusCode || 500,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Logout user
   */
  logout = async (req: AuthRequest & FastifyRequest<{ Body: LogoutBody }>, reply: FastifyReply) => {
    try {
      const { refreshToken } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        throw createError.unauthorized('User not authenticated');
      }

      if (!refreshToken) {
        throw createError.badRequest('Refresh token is required');
      }

      const result = await this.authService.logout(userId, refreshToken);

      return sendSuccess(reply, result, 'Logged out successfully');
    } catch (error: any) {
      logger.error('Logout controller error:', error);
      return reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message || 'Logout failed',
        statusCode: error.statusCode || 500,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Get user profile
   */
  getProfile = async (req: AuthRequest, reply: FastifyReply) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw createError.unauthorized('User not authenticated');
      }

      const profile = await this.authService.getProfile(userId);

      return sendSuccess(reply, profile, 'Profile retrieved successfully');
    } catch (error: any) {
      logger.error('Get profile controller error:', error);
      return reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message || 'Failed to retrieve profile',
        statusCode: error.statusCode || 500,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Request password reset
   */
  requestPasswordReset = async (
    req: FastifyRequest<{ Body: PasswordResetRequestBody }>,
    reply: FastifyReply
  ) => {
    try {
      const { email } = req.body;

      if (!email) {
        throw createError.badRequest('Email is required');
      }

      const result = await this.authService.requestPasswordReset(email);

      return sendSuccess(reply, result);
    } catch (error: any) {
      logger.error('Password reset request controller error:', error);
      return reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message || 'Password reset request failed',
        statusCode: error.statusCode || 500,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Reset password
   */
  resetPassword = async (
    req: FastifyRequest<{ Body: PasswordResetBody }>,
    reply: FastifyReply
  ) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        throw createError.badRequest('Token and new password are required');
      }

      if (newPassword.length < 8) {
        throw createError.badRequest('Password must be at least 8 characters long');
      }

      const result = await this.authService.resetPassword(token, newPassword);

      return sendSuccess(reply, result);
    } catch (error: any) {
      logger.error('Password reset controller error:', error);
      return reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message || 'Password reset failed',
        statusCode: error.statusCode || 500,
        timestamp: new Date().toISOString(),
      });
    }
  };

  /**
   * Verify email
   */
  verifyEmail = async (
    req: FastifyRequest<{ Body: EmailVerificationBody }>,
    reply: FastifyReply
  ) => {
    try {
      const { token } = req.body;

      if (!token) {
        throw createError.badRequest('Verification token is required');
      }

      const result = await this.authService.verifyEmail(token);

      return sendSuccess(reply, result);
    } catch (error: any) {
      logger.error('Email verification controller error:', error);
      return reply.status(error.statusCode || 500).send({
        success: false,
        error: error.message || 'Email verification failed',
        statusCode: error.statusCode || 500,
        timestamp: new Date().toISOString(),
      });
    }
  };
}


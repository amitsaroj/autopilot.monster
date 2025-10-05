/**
 * Auth Service
 * Business logic for authentication operations
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User, IUser } from '../models/user.model';
import { generateTokens, verifyRefreshToken } from '../../../../shared/middleware/auth.middleware';
import { createError } from '../../../../shared/middleware/error.middleware';
import { publishMessage, KafkaTopic } from '../../../../shared/config/kafka';
import { cache } from '../../../../shared/config/redis';
import { logger } from '../../../../shared/config/logger';

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company?: string;
    phone?: string;
  }) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: data.email.toLowerCase() });
      if (existingUser) {
        throw createError.conflict('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user
      const user = await User.create({
        email: data.email.toLowerCase(),
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        metadata: {
          provider: 'local',
          phone: data.phone,
          company: data.company,
        },
      });

      // Generate tokens
      const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      // Save refresh token
      user.refreshTokens.push(tokens.refreshToken);
      await user.save();

      // Publish user registered event
      await publishMessage(KafkaTopic.USER_REGISTERED, {
        userId: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        timestamp: new Date().toISOString(),
      });

      // Publish email verification event
      await publishMessage(KafkaTopic.EMAIL_VERIFICATION_REQUESTED, {
        userId: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        verificationToken,
        timestamp: new Date().toISOString(),
      });

      logger.info(`User registered: ${user.email}`);

      return {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        tokens,
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email: string, password: string) {
    try {
      // Find user with password
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      
      if (!user) {
        throw createError.unauthorized('Invalid credentials');
      }

      // Check if account is locked
      if (user.lockUntil && user.lockUntil > new Date()) {
        throw createError.unauthorized('Account is temporarily locked. Try again later.');
      }

      // Check if account is active
      if (user.status !== 'active') {
        throw createError.forbidden('Account is not active');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        // Increment login attempts
        user.loginAttempts += 1;
        
        // Lock account after 5 failed attempts
        if (user.loginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
          await user.save();
          throw createError.unauthorized('Account locked due to multiple failed login attempts');
        }
        
        await user.save();
        throw createError.unauthorized('Invalid credentials');
      }

      // Reset login attempts
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      user.lastLogin = new Date();

      // Generate tokens
      const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      // Save refresh token
      user.refreshTokens.push(tokens.refreshToken);
      
      // Keep only last 5 refresh tokens
      if (user.refreshTokens.length > 5) {
        user.refreshTokens = user.refreshTokens.slice(-5);
      }
      
      await user.save();

      // Cache user session
      await cache.set(
        `user:session:${user._id}`,
        {
          userId: user._id.toString(),
          email: user.email,
          role: user.role,
        },
        3600 // 1 hour
      );

      // Publish login event
      await publishMessage(KafkaTopic.USER_LOGGED_IN, {
        userId: user._id.toString(),
        email: user.email,
        timestamp: new Date().toISOString(),
      });

      logger.info(`User logged in: ${user.email}`);

      return {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          avatar: user.avatar,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        tokens,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);

      // Find user
      const user = await User.findById(payload.userId);
      
      if (!user) {
        throw createError.unauthorized('User not found');
      }

      // Check if refresh token exists
      if (!user.refreshTokens.includes(refreshToken)) {
        throw createError.unauthorized('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      // Replace old refresh token with new one
      user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
      user.refreshTokens.push(tokens.refreshToken);
      await user.save();

      return { tokens };
    } catch (error) {
      logger.error('Refresh token error:', error);
      throw createError.unauthorized('Invalid or expired refresh token');
    }
  }

  /**
   * Logout user
   */
  async logout(userId: string, refreshToken: string) {
    try {
      const user = await User.findById(userId);
      
      if (user) {
        // Remove refresh token
        user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
        await user.save();

        // Remove cached session
        await cache.del(`user:session:${userId}`);
      }

      logger.info(`User logged out: ${userId}`);

      return { message: 'Logged out successfully' };
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    try {
      // Try cache first
      const cached = await cache.get(`user:profile:${userId}`);
      if (cached) {
        return cached;
      }

      const user = await User.findById(userId);
      
      if (!user) {
        throw createError.notFound('User not found');
      }

      const profile = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        lastLogin: user.lastLogin,
        metadata: user.metadata,
        createdAt: user.createdAt,
      };

      // Cache profile
      await cache.set(`user:profile:${userId}`, profile, 300); // 5 minutes

      return profile;
    } catch (error) {
      logger.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      
      if (!user) {
        // Don't reveal if user exists
        return { message: 'If the email exists, a reset link has been sent' };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetExpires;
      await user.save();

      // Publish password reset event
      await publishMessage(KafkaTopic.PASSWORD_RESET_REQUESTED, {
        userId: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        resetToken,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Password reset requested: ${email}`);

      return { message: 'If the email exists, a reset link has been sent' };
    } catch (error) {
      logger.error('Password reset request error:', error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(token: string, newPassword: string) {
    try {
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() },
      });

      if (!user) {
        throw createError.badRequest('Invalid or expired reset token');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update password and clear reset token
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.refreshTokens = []; // Invalidate all sessions
      await user.save();

      logger.info(`Password reset completed: ${user.email}`);

      return { message: 'Password reset successfully' };
    } catch (error) {
      logger.error('Password reset error:', error);
      throw error;
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string) {
    try {
      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationExpires: { $gt: new Date() },
      });

      if (!user) {
        throw createError.badRequest('Invalid or expired verification token');
      }

      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save();

      // Clear cached profile
      await cache.del(`user:profile:${user._id}`);

      logger.info(`Email verified: ${user.email}`);

      return { message: 'Email verified successfully' };
    } catch (error) {
      logger.error('Email verification error:', error);
      throw error;
    }
  }
}


import { Injectable, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../user/schemas/user.schema';
import { RedisService } from '../redis/redis.service';
import { KafkaService } from '../kafka/kafka.service';
import { EmailService } from '../email/email.service';
import { GoogleAuth } from 'google-auth-library';
import { randomBytes, createHash } from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleAuth: GoogleAuth;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly kafkaService: KafkaService,
    private readonly emailService: EmailService,
  ) {
    this.googleAuth = new GoogleAuth({
      clientId: this.configService.get('oauth.google.clientId'),
    });
  }

  async register(data: any) {
    try {
      const { email, password, firstName, lastName, company, role } = data;

      // Check if user already exists
      const existingUser = await this.userModel.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return {
          success: false,
          message: 'User with this email already exists',
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, this.configService.get('security.bcryptRounds'));

      // Generate email verification token
      const verificationToken = randomBytes(32).toString('hex');
      const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Create user
      const user = new this.userModel({
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName,
        lastName,
        company,
        role: role || 'USER_ROLE_CUSTOMER',
        status: 'USER_STATUS_PENDING',
        emailVerified: false,
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
      });

      await user.save();

      // Send verification email
      if (this.configService.get('features.enableEmailVerification')) {
        await this.emailService.sendVerificationEmail(user.email, verificationToken);
      } else {
        // Auto-verify if email verification is disabled
        user.emailVerified = true;
        user.status = 'USER_STATUS_ACTIVE';
        await user.save();
      }

      // Publish user registration event
      await this.kafkaService.publishUserEvent('user.registered', user._id.toString(), {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });

      this.logger.log(`User registered: ${user.email}`);

      return {
        success: true,
        message: 'User registered successfully',
        userId: user._id.toString(),
        requiresVerification: this.configService.get('features.enableEmailVerification'),
      };
    } catch (error) {
      this.logger.error('Registration failed:', error);
      return {
        success: false,
        message: error.message || 'Registration failed',
      };
    }
  }

  async login(data: any) {
    try {
      const { email, password, rememberMe } = data;

      // Find user
      const user = await this.userModel.findOne({ email: email.toLowerCase() });
      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Check if account is locked
      if (user.isLocked) {
        return {
          success: false,
          message: 'Account is temporarily locked due to too many failed login attempts',
        };
      }

      // Check if account is active
      if (user.status !== 'USER_STATUS_ACTIVE') {
        return {
          success: false,
          message: 'Account is not active. Please contact support.',
        };
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        await this.handleFailedLogin(user);
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Reset login attempts on successful login
      if (user.loginAttempts > 0) {
        user.loginAttempts = 0;
        user.lockUntil = undefined;
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const tokens = await this.generateTokens(user, rememberMe);

      // Store refresh token in Redis
      await this.redisService.setRefreshToken(
        user._id.toString(),
        tokens.refreshToken,
        rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60, // 7 days or 1 day
      );

      // Publish login event
      await this.kafkaService.publishUserEvent('user.logged_in', user._id.toString(), {
        email: user.email,
        loginTime: new Date().toISOString(),
      });

      this.logger.log(`User logged in: ${user.email}`);

      return {
        success: true,
        message: 'Login successful',
        user: this.sanitizeUser(user),
        tokens,
      };
    } catch (error) {
      this.logger.error('Login failed:', error);
      return {
        success: false,
        message: 'Login failed',
      };
    }
  }

  async refreshToken(data: any) {
    try {
      const { refreshToken } = data;

      // Verify refresh token
      const decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.secret'),
      });

      // Check if refresh token exists in Redis
      const storedToken = await this.redisService.getRefreshToken(decoded.sub);
      if (!storedToken || storedToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Find user
      const user = await this.userModel.findById(decoded.sub);
      if (!user || user.status !== 'USER_STATUS_ACTIVE') {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(user, decoded.rememberMe);

      // Update refresh token in Redis
      await this.redisService.setRefreshToken(
        user._id.toString(),
        tokens.refreshToken,
        decoded.rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60,
      );

      return {
        success: true,
        message: 'Token refreshed successfully',
        tokens,
      };
    } catch (error) {
      this.logger.error('Token refresh failed:', error);
      return {
        success: false,
        message: 'Token refresh failed',
      };
    }
  }

  async logout(data: any) {
    try {
      const { userId, accessToken } = data;

      // Remove refresh token from Redis
      await this.redisService.deleteRefreshToken(userId);

      // Add access token to blacklist
      const decoded = this.jwtService.decode(accessToken) as any;
      if (decoded && decoded.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        await this.redisService.blacklistToken(accessToken, ttl);
      }

      // Publish logout event
      await this.kafkaService.publishUserEvent('user.logged_out', userId, {
        logoutTime: new Date().toISOString(),
      });

      this.logger.log(`User logged out: ${userId}`);

      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      this.logger.error('Logout failed:', error);
      return {
        success: false,
        message: 'Logout failed',
      };
    }
  }

  async forgotPassword(data: any) {
    try {
      const { email } = data;

      const user = await this.userModel.findOne({ email: email.toLowerCase() });
      if (!user) {
        // Don't reveal if email exists
        return {
          success: true,
          message: 'If the email exists, a password reset link has been sent',
        };
      }

      // Generate reset token
      const resetToken = randomBytes(32).toString('hex');
      const resetExpiry = new Date(Date.now() + this.configService.get('security.passwordResetExpiry'));

      user.passwordResetToken = createHash('sha256').update(resetToken).digest('hex');
      user.passwordResetExpiry = resetExpiry;
      await user.save();

      // Send reset email
      await this.emailService.sendPasswordResetEmail(user.email, resetToken);

      this.logger.log(`Password reset requested for: ${user.email}`);

      return {
        success: true,
        message: 'If the email exists, a password reset link has been sent',
      };
    } catch (error) {
      this.logger.error('Password reset request failed:', error);
      return {
        success: false,
        message: 'Password reset request failed',
      };
    }
  }

  async resetPassword(data: any) {
    try {
      const { token, newPassword } = data;

      const hashedToken = createHash('sha256').update(token).digest('hex');
      const user = await this.userModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpiry: { $gt: new Date() },
      });

      if (!user) {
        return {
          success: false,
          message: 'Invalid or expired reset token',
        };
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, this.configService.get('security.bcryptRounds'));

      // Update password and clear reset token
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpiry = undefined;
      user.loginAttempts = 0;
      user.lockUntil = undefined;

      // Add to password history if enabled
      if (this.configService.get('features.enablePasswordHistory')) {
        user.passwordHistory.push(hashedPassword);
        if (user.passwordHistory.length > 5) {
          user.passwordHistory = user.passwordHistory.slice(-5);
        }
      }

      await user.save();

      // Invalidate all user sessions
      await this.redisService.deleteRefreshToken(user._id.toString());

      this.logger.log(`Password reset completed for: ${user.email}`);

      return {
        success: true,
        message: 'Password reset successful',
      };
    } catch (error) {
      this.logger.error('Password reset failed:', error);
      return {
        success: false,
        message: 'Password reset failed',
      };
    }
  }

  async changePassword(data: any) {
    try {
      const { userId, currentPassword, newPassword } = data;

      const user = await this.userModel.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return {
          success: false,
          message: 'Current password is incorrect',
        };
      }

      // Check if new password was used recently
      if (this.configService.get('features.enablePasswordHistory')) {
        for (const oldPassword of user.passwordHistory) {
          if (await bcrypt.compare(newPassword, oldPassword)) {
            return {
              success: false,
              message: 'Cannot reuse recent passwords',
            };
          }
        }
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, this.configService.get('security.bcryptRounds'));

      // Update password
      user.password = hashedPassword;

      // Add to password history
      if (this.configService.get('features.enablePasswordHistory')) {
        user.passwordHistory.push(hashedPassword);
        if (user.passwordHistory.length > 5) {
          user.passwordHistory = user.passwordHistory.slice(-5);
        }
      }

      await user.save();

      this.logger.log(`Password changed for user: ${user.email}`);

      return {
        success: true,
        message: 'Password changed successfully',
      };
    } catch (error) {
      this.logger.error('Password change failed:', error);
      return {
        success: false,
        message: 'Password change failed',
      };
    }
  }

  async validateToken(data: any) {
    try {
      const { accessToken } = data;

      // Check if token is blacklisted
      const isBlacklisted = await this.redisService.isTokenBlacklisted(accessToken);
      if (isBlacklisted) {
        return {
          isValid: false,
          message: 'Token is blacklisted',
        };
      }

      // Verify token
      const decoded = this.jwtService.verify(accessToken, {
        secret: this.configService.get('jwt.secret'),
      });

      return {
        isValid: true,
        userId: decoded.sub,
        permissions: decoded.permissions || [],
        expiresAt: decoded.exp,
      };
    } catch (error) {
      return {
        isValid: false,
        message: error.message,
      };
    }
  }

  async getUserByToken(data: any) {
    try {
      const { accessToken } = data;

      const validation = await this.validateToken({ accessToken });
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Invalid token',
        };
      }

      const user = await this.userModel.findById(validation.userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      this.logger.error('Get user by token failed:', error);
      return {
        success: false,
        message: 'Failed to get user',
      };
    }
  }

  async getProfile(data: any) {
    try {
      const { userId } = data;

      const user = await this.userModel.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      this.logger.error('Get profile failed:', error);
      return {
        success: false,
        message: 'Failed to get profile',
      };
    }
  }

  async updateProfile(data: any) {
    try {
      const { userId, firstName, lastName, company, bio, avatarUrl, socialLinks } = data;

      const user = await this.userModel.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Update fields
      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      if (company !== undefined) user.company = company;
      if (bio !== undefined) user.bio = bio;
      if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
      if (socialLinks !== undefined) user.socialLinks = socialLinks;

      await user.save();

      this.logger.log(`Profile updated for user: ${user.email}`);

      return {
        success: true,
        message: 'Profile updated successfully',
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      this.logger.error('Profile update failed:', error);
      return {
        success: false,
        message: 'Profile update failed',
      };
    }
  }

  async googleAuth(data: any) {
    try {
      const { idToken } = data;

      // Verify Google ID token
      const client = this.googleAuth.getClient();
      const ticket = await client.verifyIdToken({
        idToken,
        audience: this.configService.get('oauth.google.clientId'),
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return {
          success: false,
          message: 'Invalid Google token',
        };
      }

      const { email, given_name, family_name, picture, sub } = payload;

      // Find or create user
      let user = await this.userModel.findOne({ email: email.toLowerCase() });
      let isNewUser = false;

      if (!user) {
        user = new this.userModel({
          email: email.toLowerCase(),
          firstName: given_name || '',
          lastName: family_name || '',
          avatarUrl: picture || '',
          role: 'USER_ROLE_CUSTOMER',
          status: 'USER_STATUS_ACTIVE',
          emailVerified: true,
          oauthProviders: {
            google: {
              id: sub,
              email,
            },
          },
        });
        await user.save();
        isNewUser = true;
      } else {
        // Update OAuth provider info
        user.oauthProviders.google = {
          id: sub,
          email,
        };
        user.lastLogin = new Date();
        await user.save();
      }

      // Generate tokens
      const tokens = await this.generateTokens(user, false);

      // Store refresh token
      await this.redisService.setRefreshToken(
        user._id.toString(),
        tokens.refreshToken,
        24 * 60 * 60, // 1 day
      );

      return {
        success: true,
        message: 'Google authentication successful',
        user: this.sanitizeUser(user),
        tokens,
        isNewUser,
      };
    } catch (error) {
      this.logger.error('Google auth failed:', error);
      return {
        success: false,
        message: 'Google authentication failed',
      };
    }
  }

  async githubAuth(data: any) {
    // Similar implementation for GitHub OAuth
    return {
      success: false,
      message: 'GitHub authentication not implemented yet',
    };
  }

  async getUsers(data: any) {
    try {
      const { page = 1, limit = 10, search, role, status } = data;

      const query: any = {};
      if (search) {
        query.$or = [
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
        ];
      }
      if (role && role !== 'USER_ROLE_UNSPECIFIED') query.role = role;
      if (status && status !== 'USER_STATUS_UNSPECIFIED') query.status = status;

      const total = await this.userModel.countDocuments(query);
      const users = await this.userModel
        .find(query)
        .select('-password -passwordHistory -emailVerificationToken -passwordResetToken -twoFactorSecret -twoFactorBackupCodes')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return {
        success: true,
        users: users.map(user => this.sanitizeUser(user)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Get users failed:', error);
      return {
        success: false,
        message: 'Failed to get users',
      };
    }
  }

  async getUserById(data: any) {
    try {
      const { userId } = data;

      const user = await this.userModel.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        success: true,
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      this.logger.error('Get user by ID failed:', error);
      return {
        success: false,
        message: 'Failed to get user',
      };
    }
  }

  async updateUserStatus(data: any) {
    try {
      const { userId, status, reason } = data;

      const user = await this.userModel.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      user.status = status;
      await user.save();

      // Publish status change event
      await this.kafkaService.publishUserEvent('user.status_changed', userId, {
        oldStatus: user.status,
        newStatus: status,
        reason,
      });

      this.logger.log(`User status updated: ${user.email} -> ${status}`);

      return {
        success: true,
        message: 'User status updated successfully',
      };
    } catch (error) {
      this.logger.error('Update user status failed:', error);
      return {
        success: false,
        message: 'Failed to update user status',
      };
    }
  }

  async deleteUser(data: any) {
    try {
      const { userId, reason } = data;

      const user = await this.userModel.findById(userId);
      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Soft delete by updating status
      user.status = 'USER_STATUS_DELETED';
      await user.save();

      // Clear all sessions
      await this.redisService.deleteRefreshToken(userId);

      // Publish deletion event
      await this.kafkaService.publishUserEvent('user.deleted', userId, {
        email: user.email,
        reason,
      });

      this.logger.log(`User deleted: ${user.email}`);

      return {
        success: true,
        message: 'User deleted successfully',
      };
    } catch (error) {
      this.logger.error('Delete user failed:', error);
      return {
        success: false,
        message: 'Failed to delete user',
      };
    }
  }

  // Helper methods
  private async generateTokens(user: UserDocument, rememberMe: boolean = false) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
      permissions: this.getUserPermissions(user.role),
      rememberMe,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwt.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: rememberMe 
        ? this.configService.get('jwt.refreshExpiresIn') 
        : this.configService.get('jwt.expiresIn'),
    });

    const accessTokenExpiresAt = Math.floor(Date.now() / 1000) + (24 * 60 * 60); // 24 hours
    const refreshTokenExpiresAt = Math.floor(Date.now() / 1000) + 
      (rememberMe ? 7 * 24 * 60 * 60 : 24 * 60 * 60); // 7 days or 1 day

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt,
      refreshTokenExpiresAt,
    };
  }

  private getUserPermissions(role: string): string[] {
    const permissions = [];
    
    switch (role) {
      case 'USER_ROLE_SUPER_ADMIN':
        permissions.push('admin:*', 'user:*', 'product:*');
        break;
      case 'USER_ROLE_ADMIN':
        permissions.push('admin:read', 'user:manage', 'product:manage');
        break;
      case 'USER_ROLE_VENDOR':
        permissions.push('vendor:manage', 'product:create', 'product:update');
        break;
      case 'USER_ROLE_CUSTOMER':
        permissions.push('user:read', 'product:read');
        break;
    }
    
    return permissions;
  }

  private async handleFailedLogin(user: UserDocument) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    
    const maxAttempts = this.configService.get('security.maxLoginAttempts');
    const lockoutDuration = this.configService.get('security.lockoutDuration');
    
    if (user.loginAttempts >= maxAttempts) {
      user.lockUntil = new Date(Date.now() + lockoutDuration);
    }
    
    await user.save();
  }

  private sanitizeUser(user: UserDocument) {
    const userObj = user.toJSON();
    delete userObj.password;
    delete userObj.passwordHistory;
    delete userObj.emailVerificationToken;
    delete userObj.passwordResetToken;
    delete userObj.twoFactorSecret;
    delete userObj.twoFactorBackupCodes;
    return userObj;
  }
}

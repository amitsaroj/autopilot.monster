import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

// Import gRPC generated types (these would be generated from proto files)
interface AuthServiceGrpc {
  login(data: any): Promise<any>;
  register(data: any): Promise<any>;
  refreshToken(data: any): Promise<any>;
  logout(data: any): Promise<any>;
  forgotPassword(data: any): Promise<any>;
  resetPassword(data: any): Promise<any>;
  changePassword(data: any): Promise<any>;
  validateToken(data: any): Promise<any>;
  getUserByToken(data: any): Promise<any>;
  getProfile(data: any): Promise<any>;
  updateProfile(data: any): Promise<any>;
  googleAuth(data: any): Promise<any>;
  githubAuth(data: any): Promise<any>;
}

@Injectable()
export class AuthService {
  private authService: AuthServiceGrpc;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('AUTH_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthServiceGrpc>('AuthService');
  }

  async register(registerDto: RegisterDto) {
    try {
      const result = await this.authService.register({
        email: registerDto.email,
        password: registerDto.password,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        company: registerDto.company,
        role: registerDto.role || 'USER_ROLE_CUSTOMER',
      });

      if (!result.success) {
        throw new BadRequestException(result.message);
      }

      return {
        success: true,
        message: result.message,
        userId: result.userId,
        requiresVerification: result.requiresVerification,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Registration failed');
    }
  }

  async login(user: any, rememberMe: boolean = false) {
    try {
      const result = await this.authService.login({
        email: user.email,
        password: user.password,
        rememberMe,
      });

      if (!result.success) {
        throw new UnauthorizedException(result.message);
      }

      return {
        success: true,
        message: result.message,
        user: result.user,
        tokens: result.tokens,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Login failed');
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const result = await this.authService.refreshToken({
        refreshToken,
      });

      if (!result.success) {
        throw new UnauthorizedException(result.message);
      }

      return {
        success: true,
        message: result.message,
        tokens: result.tokens,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Token refresh failed');
    }
  }

  async logout(userId: string, accessToken: string) {
    try {
      const result = await this.authService.logout({
        userId,
        accessToken,
      });

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Logout failed');
    }
  }

  async forgotPassword(email: string) {
    try {
      const result = await this.authService.forgotPassword({
        email,
      });

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Password reset request failed');
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const result = await this.authService.resetPassword({
        token,
        newPassword,
      });

      if (!result.success) {
        throw new BadRequestException(result.message);
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Password reset failed');
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      const result = await this.authService.changePassword({
        userId,
        currentPassword,
        newPassword,
      });

      if (!result.success) {
        throw new BadRequestException(result.message);
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Password change failed');
    }
  }

  async validateToken(token: string) {
    try {
      const result = await this.authService.validateToken({
        accessToken: token,
      });

      return {
        isValid: result.isValid,
        userId: result.userId,
        permissions: result.permissions,
        expiresAt: result.expiresAt,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Token validation failed');
    }
  }

  async getProfile(userId: string) {
    try {
      const result = await this.authService.getProfile({
        userId,
      });

      if (!result.success) {
        throw new BadRequestException(result.message);
      }

      return {
        success: true,
        user: result.user,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to get profile');
    }
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    try {
      const result = await this.authService.updateProfile({
        userId,
        firstName: updateProfileDto.firstName,
        lastName: updateProfileDto.lastName,
        company: updateProfileDto.company,
        bio: updateProfileDto.bio,
        avatarUrl: updateProfileDto.avatarUrl,
        socialLinks: updateProfileDto.socialLinks || {},
      });

      if (!result.success) {
        throw new BadRequestException(result.message);
      }

      return {
        success: true,
        message: result.message,
        user: result.user,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Profile update failed');
    }
  }

  async handleOAuthLogin(oauthUser: any, provider: string) {
    try {
      let result;
      
      if (provider === 'google') {
        result = await this.authService.googleAuth({
          idToken: oauthUser.idToken,
          accessToken: oauthUser.accessToken,
        });
      } else if (provider === 'github') {
        result = await this.authService.githubAuth({
          code: oauthUser.code,
          state: oauthUser.state,
        });
      }

      if (!result.success) {
        throw new UnauthorizedException(result.message);
      }

      return {
        success: true,
        message: result.message,
        user: result.user,
        tokens: result.tokens,
        isNewUser: result.isNewUser,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message || 'OAuth login failed');
    }
  }

  async getUserFromToken(token: string) {
    try {
      const result = await this.authService.getUserByToken({
        accessToken: token,
      });

      if (!result.success) {
        throw new UnauthorizedException('Invalid token');
      }

      return result.user;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Token validation failed');
    }
  }

  // Helper method for local validation (used by local strategy)
  async validateLocalUser(email: string, password: string) {
    try {
      const result = await this.authService.login({
        email,
        password,
        rememberMe: false,
      });

      if (!result.success) {
        return null;
      }

      return result.user;
    } catch (error) {
      return null;
    }
  }
}

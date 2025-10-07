/**
 * Authentication Middleware
 * JWT-based authentication for protecting routes
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env';
import { JwtPayload, UserRole } from '../types';
import { logger } from '../config/logger';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * Verify JWT token and attach user to request
 */
export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'No token provided',
        statusCode: 401,
        timestamp: new Date().toISOString(),
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, envConfig.get('JWT_SECRET')) as JwtPayload;
      req.user = decoded;
      next();
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Token has expired',
          statusCode: 401,
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid token',
        statusCode: 401,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Authentication failed',
      statusCode: 500,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Optional authentication - attaches user if token exists but doesn't fail if missing
 */
export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, envConfig.get('JWT_SECRET')) as JwtPayload;
      req.user = decoded;
    } catch (error) {
      // Token invalid, but that's okay for optional auth
      logger.debug('Optional auth token invalid, continuing without user');
    }

    next();
  } catch (error) {
    logger.error('Optional authentication error:', error);
    next();
  }
}

/**
 * Role-based access control middleware
 * @param roles - Allowed roles
 */
export function authorize(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required',
        statusCode: 401,
        timestamp: new Date().toISOString(),
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Insufficient permissions',
        statusCode: 403,
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
}

/**
 * Check if user owns the resource
 * @param getUserId - Function to extract user ID from request params/body
 */
export function authorizeOwner(getUserId: (req: AuthRequest) => string) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required',
        statusCode: 401,
        timestamp: new Date().toISOString(),
      });
    }

    const resourceUserId = getUserId(req);

    if (req.user.userId !== resourceUserId && req.user.role !== UserRole.ADMIN) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You do not have permission to access this resource',
        statusCode: 403,
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
}

/**
 * Generate JWT access token
 * @param payload - Token payload
 */
export function generateAccessToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, envConfig.get('JWT_SECRET'), {
    expiresIn: envConfig.get('JWT_EXPIRES_IN'),
  });
}

/**
 * Generate JWT refresh token
 * @param payload - Token payload
 */
export function generateRefreshToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, envConfig.get('JWT_REFRESH_SECRET'), {
    expiresIn: envConfig.get('JWT_REFRESH_EXPIRES_IN'),
  });
}

/**
 * Verify refresh token
 * @param token - Refresh token
 */
export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, envConfig.get('JWT_REFRESH_SECRET')) as JwtPayload;
}

/**
 * Generate both access and refresh tokens
 * @param payload - Token payload
 */
export function generateTokens(payload: Omit<JwtPayload, 'iat' | 'exp'>) {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
    expiresIn: parseExpiresIn(envConfig.get('JWT_EXPIRES_IN')),
  };
}

/**
 * Parse expires in string to seconds
 * @param expiresIn - Expiration string (e.g., '1h', '7d')
 */
function parseExpiresIn(expiresIn: string): number {
  const unit = expiresIn.slice(-1);
  const value = parseInt(expiresIn.slice(0, -1));

  switch (unit) {
    case 's':
      return value;
    case 'm':
      return value * 60;
    case 'h':
      return value * 3600;
    case 'd':
      return value * 86400;
    default:
      return 3600; // Default 1 hour
  }
}


/**
 * Error Handling Middleware
 * Centralized error handler for consistent API responses
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { ErrorResponse } from '../types';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * Error handler middleware
 */
export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.name === 'MongoError' && (err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate key error';
  }

  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: message,
    message: err.message,
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development' && !isOperational) {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
}

/**
 * Not Found handler middleware
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Common error factories
 */
export const createError = {
  badRequest: (message: string = 'Bad Request') => new ApiError(400, message),
  unauthorized: (message: string = 'Unauthorized') => new ApiError(401, message),
  forbidden: (message: string = 'Forbidden') => new ApiError(403, message),
  notFound: (message: string = 'Resource not found') => new ApiError(404, message),
  conflict: (message: string = 'Conflict') => new ApiError(409, message),
  unprocessable: (message: string = 'Unprocessable Entity') => new ApiError(422, message),
  tooManyRequests: (message: string = 'Too Many Requests') => new ApiError(429, message),
  internal: (message: string = 'Internal Server Error') => new ApiError(500, message),
};


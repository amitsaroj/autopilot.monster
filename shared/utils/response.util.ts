/**
 * Response Utilities
 * Helper functions for consistent API responses
 */

import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

/**
 * Send success response
 */
export function sendSuccess<T = any>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    statusCode,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
}

/**
 * Send paginated response
 */
export function sendPaginated<T = any>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  statusCode: number = 200
): Response {
  const totalPages = Math.ceil(total / limit);
  
  const response: PaginatedResponse<T> = {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
}

/**
 * Send created response
 */
export function sendCreated<T = any>(res: Response, data?: T, message?: string): Response {
  return sendSuccess(res, data, message || 'Resource created successfully', 201);
}

/**
 * Send no content response
 */
export function sendNoContent(res: Response): Response {
  return res.status(204).send();
}

/**
 * Build pagination metadata
 */
export function buildPagination(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit);
  
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Calculate skip for pagination
 */
export function calculateSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}


/**
 * Validation Middleware
 * Request validation using express-validator
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ApiError } from './error.middleware';

/**
 * Validate request using express-validator rules
 * @param validations - Array of validation chains
 */
export function validate(validations: ValidationChain[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = errors.array().map((err: any) => ({
      field: err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Invalid request data',
      statusCode: 400,
      timestamp: new Date().toISOString(),
      errors: extractedErrors,
    });
  };
}

/**
 * Sanitize request body by removing undefined and null values
 */
export function sanitizeBody(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === undefined || req.body[key] === null) {
        delete req.body[key];
      }
    });
  }
  next();
}

/**
 * Parse pagination parameters
 */
export function parsePagination(req: Request, res: Response, next: NextFunction) {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const sortOrder = (req.query.sortOrder as string) === 'asc' ? 1 : -1;

  req.query.page = page.toString();
  req.query.limit = limit.toString();
  req.query.sortBy = sortBy;
  req.query.sortOrder = sortOrder.toString();

  next();
}

/**
 * Parse filter parameters
 */
export function parseFilters(req: Request, res: Response, next: NextFunction) {
  const filters: any = {};

  // Search
  if (req.query.search) {
    filters.search = req.query.search as string;
  }

  // Status
  if (req.query.status) {
    filters.status = req.query.status as string;
  }

  // Type
  if (req.query.type) {
    filters.type = req.query.type as string;
  }

  // Category
  if (req.query.category) {
    filters.category = req.query.category as string;
  }

  // Price range
  if (req.query.minPrice) {
    filters.minPrice = parseFloat(req.query.minPrice as string);
  }
  if (req.query.maxPrice) {
    filters.maxPrice = parseFloat(req.query.maxPrice as string);
  }

  // Boolean filters
  if (req.query.featured !== undefined) {
    filters.featured = req.query.featured === 'true';
  }
  if (req.query.trending !== undefined) {
    filters.trending = req.query.trending === 'true';
  }

  req.query.filters = JSON.stringify(filters);

  next();
}

/**
 * Validate MongoDB ObjectId
 */
export function validateObjectId(paramName: string = 'id') {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName];
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;

    if (!objectIdPattern.test(id)) {
      throw new ApiError(400, `Invalid ${paramName} format`);
    }

    next();
  };
}

/**
 * Validate required fields
 */
export function validateRequired(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing: string[] = [];

    fields.forEach((field) => {
      if (!req.body[field]) {
        missing.push(field);
      }
    });

    if (missing.length > 0) {
      throw new ApiError(400, `Missing required fields: ${missing.join(', ')}`);
    }

    next();
  };
}


/**
 * Marketplace Routes
 */

import { FastifyInstance } from 'fastify';
import { marketplaceController } from '../controllers/marketplace.controller';
import { authenticate } from '../../../../shared/middleware/auth.middleware';

export default async function marketplaceRoutes(app: FastifyInstance) {
  // Search products
  app.get('/products', {
    schema: {
      description: 'Search and filter products',
      tags: ['Marketplace'],
      querystring: {
        type: 'object',
        properties: {
          search: { type: 'string' },
          category: { type: 'string' },
          minPrice: { type: 'number' },
          maxPrice: { type: 'number' },
          minRating: { type: 'number' },
          tags: { type: 'array', items: { type: 'string' } },
          sortBy: { type: 'string', enum: ['price_asc', 'price_desc', 'rating', 'popular', 'newest'] },
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 },
        },
      },
    },
  }, marketplaceController.searchProducts.bind(marketplaceController));

  // Get featured products
  app.get('/products/featured', {
    schema: {
      description: 'Get featured products',
      tags: ['Marketplace'],
    },
  }, marketplaceController.getFeaturedProducts.bind(marketplaceController));

  // Get popular products
  app.get('/products/popular', {
    schema: {
      description: 'Get popular products',
      tags: ['Marketplace'],
    },
  }, marketplaceController.getPopularProducts.bind(marketplaceController));

  // Get single product
  app.get('/products/:productId', {
    schema: {
      description: 'Get product by ID',
      tags: ['Marketplace'],
      params: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
        },
      },
    },
  }, marketplaceController.getProduct.bind(marketplaceController));

  // Create product (vendor only)
  app.post('/products', {
    preHandler: authenticate,
    schema: {
      description: 'Create new product',
      tags: ['Marketplace'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name', 'description', 'price', 'category'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          category: { type: 'string' },
          images: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  }, marketplaceController.createProduct.bind(marketplaceController));

  // Update product
  app.put('/products/:productId', {
    preHandler: authenticate,
    schema: {
      description: 'Update product',
      tags: ['Marketplace'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
        },
      },
    },
  }, marketplaceController.updateProduct.bind(marketplaceController));

  // Delete product
  app.delete('/products/:productId', {
    preHandler: authenticate,
    schema: {
      description: 'Delete product',
      tags: ['Marketplace'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
        },
      },
    },
  }, marketplaceController.deleteProduct.bind(marketplaceController));

  // Get categories
  app.get('/categories', {
    schema: {
      description: 'Get all categories',
      tags: ['Marketplace'],
    },
  }, marketplaceController.getCategories.bind(marketplaceController));

  // Get product reviews
  app.get('/products/:productId/reviews', {
    schema: {
      description: 'Get product reviews',
      tags: ['Reviews'],
      params: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
        },
      },
    },
  }, marketplaceController.getProductReviews.bind(marketplaceController));

  // Create review
  app.post('/products/:productId/reviews', {
    preHandler: authenticate,
    schema: {
      description: 'Create product review',
      tags: ['Reviews'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          productId: { type: 'string' },
        },
      },
      body: {
        type: 'object',
        required: ['rating', 'comment'],
        properties: {
          rating: { type: 'number', minimum: 1, maximum: 5 },
          title: { type: 'string' },
          comment: { type: 'string' },
        },
      },
    },
  }, marketplaceController.createReview.bind(marketplaceController));
}


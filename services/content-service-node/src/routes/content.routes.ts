/**
 * Content Routes
 */

import { FastifyInstance } from 'fastify';
import { contentController } from '../controllers/content.controller';
import { authenticate } from '../../../../shared/middleware/auth.middleware';

export default async function contentRoutes(app: FastifyInstance) {
  // Blog routes
  app.post('/blog', {
    preHandler: authenticate,
    schema: {
      description: 'Create blog post',
      tags: ['Blog'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title', 'content', 'category'],
        properties: {
          title: { type: 'string' },
          content: { type: 'string' },
          excerpt: { type: 'string' },
          category: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          featuredImage: { type: 'string' },
          status: { type: 'string', enum: ['draft', 'published'] },
        },
      },
    },
  }, contentController.createBlog.bind(contentController));

  app.get('/blog', {
    schema: {
      description: 'Get all blog posts',
      tags: ['Blog'],
      querystring: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          search: { type: 'string' },
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 },
        },
      },
    },
  }, contentController.getBlogs.bind(contentController));

  app.get('/blog/:slug', {
    schema: {
      description: 'Get blog post by slug',
      tags: ['Blog'],
      params: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
        },
      },
    },
  }, contentController.getBlog.bind(contentController));

  // Tutorial routes
  app.post('/tutorials', {
    preHandler: authenticate,
    schema: {
      description: 'Create tutorial',
      tags: ['Tutorials'],
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title', 'description', 'content', 'category', 'duration'],
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          content: { type: 'string' },
          category: { type: 'string' },
          difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
          duration: { type: 'number' },
          videoUrl: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          status: { type: 'string', enum: ['draft', 'published'] },
        },
      },
    },
  }, contentController.createTutorial.bind(contentController));

  app.get('/tutorials', {
    schema: {
      description: 'Get all tutorials',
      tags: ['Tutorials'],
      querystring: {
        type: 'object',
        properties: {
          category: { type: 'string' },
          difficulty: { type: 'string' },
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 },
        },
      },
    },
  }, contentController.getTutorials.bind(contentController));

  app.get('/tutorials/:slug', {
    schema: {
      description: 'Get tutorial by slug',
      tags: ['Tutorials'],
      params: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
        },
      },
    },
  }, contentController.getTutorial.bind(contentController));
}

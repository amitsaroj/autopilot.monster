/**
 * Content Controller
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { contentService } from '../services/content.service';
import { sendSuccess, sendError } from '../../../../shared/utils/response.util';
import { logger } from '../../../../shared/config/logger';

export class ContentController {
  async createBlog(req: any, reply: FastifyReply) {
    try {
      const authorId = req.user?.userId;
      const author = req.user?.name || 'Anonymous';

      if (!authorId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const blog = await contentService.createBlog(authorId, author, req.body);
      return sendSuccess(reply, blog, 'Blog created successfully', 201);
    } catch (error: any) {
      logger.error('Error in createBlog:', error);
      return sendError(reply, error.message);
    }
  }

  async getBlogs(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { category, search, page = 1, limit = 20 } = req.query as any;
      const result = await contentService.getBlogs({ category, search }, parseInt(page), parseInt(limit));
      return sendSuccess(reply, result, 'Blogs retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getBlogs:', error);
      return sendError(reply, error.message);
    }
  }

  async getBlog(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { slug } = req.params as any;
      const blog = await contentService.getBlogBySlug(slug);

      if (!blog) {
        return sendError(reply, 'Blog not found', 404);
      }

      return sendSuccess(reply, blog, 'Blog retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getBlog:', error);
      return sendError(reply, error.message);
    }
  }

  async createTutorial(req: any, reply: FastifyReply) {
    try {
      const authorId = req.user?.userId;
      const author = req.user?.name || 'Anonymous';

      if (!authorId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const tutorial = await contentService.createTutorial(authorId, author, req.body);
      return sendSuccess(reply, tutorial, 'Tutorial created successfully', 201);
    } catch (error: any) {
      logger.error('Error in createTutorial:', error);
      return sendError(reply, error.message);
    }
  }

  async getTutorials(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { category, difficulty, page = 1, limit = 20 } = req.query as any;
      const result = await contentService.getTutorials({ category, difficulty }, parseInt(page), parseInt(limit));
      return sendSuccess(reply, result, 'Tutorials retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getTutorials:', error);
      return sendError(reply, error.message);
    }
  }

  async getTutorial(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { slug } = req.params as any;
      const tutorial = await contentService.getTutorialBySlug(slug);

      if (!tutorial) {
        return sendError(reply, 'Tutorial not found', 404);
      }

      return sendSuccess(reply, tutorial, 'Tutorial retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getTutorial:', error);
      return sendError(reply, error.message);
    }
  }
}

export const contentController = new ContentController();

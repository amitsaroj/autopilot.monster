/**
 * Content Service - Business Logic
 */

import { Blog, IBlog } from '../models/blog.model';
import { Tutorial, ITutorial } from '../models/tutorial.model';
import { publishMessage, KafkaTopic } from '../../../../shared/config/kafka';
import { cache } from '../../../../shared/config/redis';
import { logger } from '../../../../shared/config/logger';
import { v4 as uuidv4 } from 'uuid';

export class ContentService {
  /**
   * Create blog post
   */
  async createBlog(authorId: string, author: string, blogData: Partial<IBlog>): Promise<IBlog> {
    try {
      const blogId = `blog_${uuidv4()}`;
      const slug = blogData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || blogId;

      const blog = await Blog.create({
        blogId,
        slug,
        authorId,
        author,
        ...blogData,
        viewCount: 0,
        likeCount: 0,
      });

      await publishMessage(KafkaTopic.CONTENT_CREATED, {
        contentId: blogId,
        type: 'blog',
        title: blog.title,
        timestamp: new Date().toISOString(),
      });

      return blog;
    } catch (error) {
      logger.error('Error creating blog:', error);
      throw new Error('Failed to create blog');
    }
  }

  /**
   * Get all blogs
   */
  async getBlogs(filters: any = {}, page = 1, limit = 20): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const query: any = { status: 'published' };

      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.search) {
        query.$text = { $search: filters.search };
      }

      const [blogs, total] = await Promise.all([
        Blog.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limit),
        Blog.countDocuments(query),
      ]);

      return {
        blogs,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting blogs:', error);
      throw new Error('Failed to get blogs');
    }
  }

  /**
   * Get blog by slug
   */
  async getBlogBySlug(slug: string): Promise<IBlog | null> {
    try {
      const blog = await Blog.findOne({ slug, status: 'published' });
      
      if (blog) {
        // Increment view count
        await Blog.updateOne({ blogId: blog.blogId }, { $inc: { viewCount: 1 } });
      }

      return blog;
    } catch (error) {
      logger.error('Error getting blog:', error);
      throw new Error('Failed to get blog');
    }
  }

  /**
   * Update blog
   */
  async updateBlog(blogId: string, updates: Partial<IBlog>): Promise<IBlog | null> {
    try {
      const blog = await Blog.findOneAndUpdate(
        { blogId },
        { $set: updates },
        { new: true }
      );

      return blog;
    } catch (error) {
      logger.error('Error updating blog:', error);
      throw new Error('Failed to update blog');
    }
  }

  /**
   * Delete blog
   */
  async deleteBlog(blogId: string): Promise<boolean> {
    try {
      const result = await Blog.updateOne({ blogId }, { status: 'archived' });
      return result.modifiedCount > 0;
    } catch (error) {
      logger.error('Error deleting blog:', error);
      throw new Error('Failed to delete blog');
    }
  }

  /**
   * Create tutorial
   */
  async createTutorial(authorId: string, author: string, tutorialData: Partial<ITutorial>): Promise<ITutorial> {
    try {
      const tutorialId = `tutorial_${uuidv4()}`;
      const slug = tutorialData.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') || tutorialId;

      const tutorial = await Tutorial.create({
        tutorialId,
        slug,
        authorId,
        author,
        ...tutorialData,
        viewCount: 0,
        likeCount: 0,
      });

      await publishMessage(KafkaTopic.CONTENT_CREATED, {
        contentId: tutorialId,
        type: 'tutorial',
        title: tutorial.title,
        timestamp: new Date().toISOString(),
      });

      return tutorial;
    } catch (error) {
      logger.error('Error creating tutorial:', error);
      throw new Error('Failed to create tutorial');
    }
  }

  /**
   * Get all tutorials
   */
  async getTutorials(filters: any = {}, page = 1, limit = 20): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const query: any = { status: 'published' };

      if (filters.category) {
        query.category = filters.category;
      }

      if (filters.difficulty) {
        query.difficulty = filters.difficulty;
      }

      const [tutorials, total] = await Promise.all([
        Tutorial.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Tutorial.countDocuments(query),
      ]);

      return {
        tutorials,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting tutorials:', error);
      throw new Error('Failed to get tutorials');
    }
  }

  /**
   * Get tutorial by slug
   */
  async getTutorialBySlug(slug: string): Promise<ITutorial | null> {
    try {
      const tutorial = await Tutorial.findOne({ slug, status: 'published' });
      
      if (tutorial) {
        await Tutorial.updateOne({ tutorialId: tutorial.tutorialId }, { $inc: { viewCount: 1 } });
      }

      return tutorial;
    } catch (error) {
      logger.error('Error getting tutorial:', error);
      throw new Error('Failed to get tutorial');
    }
  }
}

export const contentService = new ContentService();

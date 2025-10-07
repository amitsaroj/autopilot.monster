/**
 * Content API - Blog posts, help articles, and other content endpoints
 */

import apiClient from './client';

export interface BlogPost {
  postId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  category: string;
  tags: string[];
  featuredImage?: string;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  views: number;
}

export interface HelpArticle {
  articleId: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobListing {
  jobId: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  postedAt: string;
  closingDate?: string;
  status: 'open' | 'closed';
}

export const contentApi = {
  /**
   * Get all blog posts
   */
  getBlogPosts: async (params?: { page?: number; limit?: number; category?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get<{
      success: boolean;
      data: {
        posts: BlogPost[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          pages: number;
        };
      };
    }>(`/api/content/blog?${queryParams.toString()}`);
  },

  /**
   * Get blog post by slug
   */
  getBlogPost: async (slug: string) => {
    return apiClient.get<{ success: boolean; data: BlogPost }>(
      `/api/content/blog/${slug}`
    );
  },

  /**
   * Get featured blog posts
   */
  getFeaturedPosts: async (limit: number = 5) => {
    return apiClient.get<{ success: boolean; data: BlogPost[] }>(
      `/api/content/blog/featured?limit=${limit}`
    );
  },

  /**
   * Get all help articles
   */
  getHelpArticles: async (params?: { category?: string; search?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get<{
      success: boolean;
      data: HelpArticle[];
    }>(`/api/content/help?${queryParams.toString()}`);
  },

  /**
   * Get help article by slug
   */
  getHelpArticle: async (slug: string) => {
    return apiClient.get<{ success: boolean; data: HelpArticle }>(
      `/api/content/help/${slug}`
    );
  },

  /**
   * Mark help article as helpful
   */
  markHelpful: async (articleId: string, helpful: boolean) => {
    return apiClient.post<{ success: boolean; message: string }>(
      `/api/content/help/${articleId}/feedback`,
      { helpful },
      {}
    );
  },

  /**
   * Get all job listings
   */
  getJobs: async (params?: { department?: string; location?: string; type?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get<{
      success: boolean;
      data: JobListing[];
    }>(`/api/content/jobs?${queryParams.toString()}`);
  },

  /**
   * Get job by ID
   */
  getJob: async (jobId: string) => {
    return apiClient.get<{ success: boolean; data: JobListing }>(
      `/api/content/jobs/${jobId}`
    );
  },

  /**
   * Apply for a job
   */
  applyForJob: async (jobId: string, application: {
    name: string;
    email: string;
    phone: string;
    resume: string;
    coverLetter?: string;
  }) => {
    return apiClient.post<{ success: boolean; message: string }>(
      `/api/content/jobs/${jobId}/apply`,
      application,
      {}
    );
  },
};

export default contentApi;


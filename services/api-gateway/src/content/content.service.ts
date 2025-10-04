import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ContentService {
  private readonly logger = new Logger(ContentService.name);
  private readonly contentServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.contentServiceUrl = this.configService.get<string>('CONTENT_SERVICE_URL', 'http://localhost:3008');
  }

  // Blog methods
  async getBlogPosts(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/blog/posts`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting blog posts:', error.message);
      throw error;
    }
  }

  async getBlogPost(slug: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/blog/posts/${slug}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting blog post:', error.message);
      throw error;
    }
  }

  async createBlogPost(data: { authorId: string; [key: string]: any }) {
    try {
      const { authorId, ...postData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.contentServiceUrl}/api/v1/blog/posts`, postData, {
          headers: { 'X-User-ID': authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error creating blog post:', error.message);
      throw error;
    }
  }

  async updateBlogPost(data: { postId: string; authorId: string; [key: string]: any }) {
    try {
      const { postId, authorId, ...postData } = data;
      const response = await firstValueFrom(
        this.httpService.put(`${this.contentServiceUrl}/api/v1/blog/posts/${postId}`, postData, {
          headers: { 'X-User-ID': authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error updating blog post:', error.message);
      throw error;
    }
  }

  async deleteBlogPost(data: { postId: string; authorId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.contentServiceUrl}/api/v1/blog/posts/${data.postId}`, {
          headers: { 'X-User-ID': data.authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error deleting blog post:', error.message);
      throw error;
    }
  }

  // Help Center methods
  async getHelpArticles(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/help/articles`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting help articles:', error.message);
      throw error;
    }
  }

  async getHelpArticle(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/help/articles/${id}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting help article:', error.message);
      throw error;
    }
  }

  async getHelpCategories() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/help/categories`),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting help categories:', error.message);
      throw error;
    }
  }

  async createHelpArticle(data: { authorId: string; [key: string]: any }) {
    try {
      const { authorId, ...articleData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.contentServiceUrl}/api/v1/help/articles`, articleData, {
          headers: { 'X-User-ID': authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error creating help article:', error.message);
      throw error;
    }
  }

  async updateHelpArticle(data: { articleId: string; authorId: string; [key: string]: any }) {
    try {
      const { articleId, authorId, ...articleData } = data;
      const response = await firstValueFrom(
        this.httpService.put(`${this.contentServiceUrl}/api/v1/help/articles/${articleId}`, articleData, {
          headers: { 'X-User-ID': authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error updating help article:', error.message);
      throw error;
    }
  }

  async deleteHelpArticle(data: { articleId: string; authorId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.contentServiceUrl}/api/v1/help/articles/${data.articleId}`, {
          headers: { 'X-User-ID': data.authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error deleting help article:', error.message);
      throw error;
    }
  }

  async searchHelpArticles(query: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/help/articles/search`, {
          params: { q: query },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error searching help articles:', error.message);
      throw error;
    }
  }

  // Tutorials methods
  async getTutorials(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/tutorials`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting tutorials:', error.message);
      throw error;
    }
  }

  async getTutorial(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/tutorials/${id}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting tutorial:', error.message);
      throw error;
    }
  }

  async createTutorial(data: { authorId: string; [key: string]: any }) {
    try {
      const { authorId, ...tutorialData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.contentServiceUrl}/api/v1/tutorials`, tutorialData, {
          headers: { 'X-User-ID': authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error creating tutorial:', error.message);
      throw error;
    }
  }

  async updateTutorial(data: { tutorialId: string; authorId: string; [key: string]: any }) {
    try {
      const { tutorialId, authorId, ...tutorialData } = data;
      const response = await firstValueFrom(
        this.httpService.put(`${this.contentServiceUrl}/api/v1/tutorials/${tutorialId}`, tutorialData, {
          headers: { 'X-User-ID': authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error updating tutorial:', error.message);
      throw error;
    }
  }

  async deleteTutorial(data: { tutorialId: string; authorId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.contentServiceUrl}/api/v1/tutorials/${data.tutorialId}`, {
          headers: { 'X-User-ID': data.authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error deleting tutorial:', error.message);
      throw error;
    }
  }

  async getTutorialCategories() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/tutorials/categories`),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting tutorial categories:', error.message);
      throw error;
    }
  }

  // Resources methods
  async getResources(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/resources`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting resources:', error.message);
      throw error;
    }
  }

  async getResource(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/resources/${id}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting resource:', error.message);
      throw error;
    }
  }

  async createResource(data: { authorId: string; [key: string]: any }) {
    try {
      const { authorId, ...resourceData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.contentServiceUrl}/api/v1/resources`, resourceData, {
          headers: { 'X-User-ID': authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error creating resource:', error.message);
      throw error;
    }
  }

  async updateResource(data: { resourceId: string; authorId: string; [key: string]: any }) {
    try {
      const { resourceId, authorId, ...resourceData } = data;
      const response = await firstValueFrom(
        this.httpService.put(`${this.contentServiceUrl}/api/v1/resources/${resourceId}`, resourceData, {
          headers: { 'X-User-ID': authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error updating resource:', error.message);
      throw error;
    }
  }

  async deleteResource(data: { resourceId: string; authorId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.contentServiceUrl}/api/v1/resources/${data.resourceId}`, {
          headers: { 'X-User-ID': data.authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error deleting resource:', error.message);
      throw error;
    }
  }

  async downloadResource(data: { resourceId: string; userId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/resources/${data.resourceId}/download`, {
          headers: { 'X-User-ID': data.userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error downloading resource:', error.message);
      throw error;
    }
  }

  // Case Studies methods
  async getCaseStudies(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/case-studies`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting case studies:', error.message);
      throw error;
    }
  }

  async getCaseStudy(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/case-studies/${id}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting case study:', error.message);
      throw error;
    }
  }

  async createCaseStudy(data: { authorId: string; [key: string]: any }) {
    try {
      const { authorId, ...caseStudyData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.contentServiceUrl}/api/v1/case-studies`, caseStudyData, {
          headers: { 'X-User-ID': authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error creating case study:', error.message);
      throw error;
    }
  }

  async updateCaseStudy(data: { caseStudyId: string; authorId: string; [key: string]: any }) {
    try {
      const { caseStudyId, authorId, ...caseStudyData } = data;
      const response = await firstValueFrom(
        this.httpService.put(`${this.contentServiceUrl}/api/v1/case-studies/${caseStudyId}`, caseStudyData, {
          headers: { 'X-User-ID': authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error updating case study:', error.message);
      throw error;
    }
  }

  async deleteCaseStudy(data: { caseStudyId: string; authorId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.contentServiceUrl}/api/v1/case-studies/${data.caseStudyId}`, {
          headers: { 'X-User-ID': data.authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error deleting case study:', error.message);
      throw error;
    }
  }

  // Press Releases methods
  async getPressReleases(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/press`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting press releases:', error.message);
      throw error;
    }
  }

  async getPressRelease(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/press/${id}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting press release:', error.message);
      throw error;
    }
  }

  async createPressRelease(data: { authorId: string; [key: string]: any }) {
    try {
      const { authorId, ...pressData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.contentServiceUrl}/api/v1/press`, pressData, {
          headers: { 'X-User-ID': authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error creating press release:', error.message);
      throw error;
    }
  }

  async updatePressRelease(data: { pressId: string; authorId: string; [key: string]: any }) {
    try {
      const { pressId, authorId, ...pressData } = data;
      const response = await firstValueFrom(
        this.httpService.put(`${this.contentServiceUrl}/api/v1/press/${pressId}`, pressData, {
          headers: { 'X-User-ID': authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error updating press release:', error.message);
      throw error;
    }
  }

  async deletePressRelease(data: { pressId: string; authorId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.contentServiceUrl}/api/v1/press/${data.pressId}`, {
          headers: { 'X-User-ID': data.authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error deleting press release:', error.message);
      throw error;
    }
  }

  // Careers methods
  async getJobListings(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/careers/jobs`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting job listings:', error.message);
      throw error;
    }
  }

  async getJobListing(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/careers/jobs/${id}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting job listing:', error.message);
      throw error;
    }
  }

  async createJobListing(data: { authorId: string; [key: string]: any }) {
    try {
      const { authorId, ...jobData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.contentServiceUrl}/api/v1/careers/jobs`, jobData, {
          headers: { 'X-User-ID': authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error creating job listing:', error.message);
      throw error;
    }
  }

  async updateJobListing(data: { jobId: string; authorId: string; [key: string]: any }) {
    try {
      const { jobId, authorId, ...jobData } = data;
      const response = await firstValueFrom(
        this.httpService.put(`${this.contentServiceUrl}/api/v1/careers/jobs/${jobId}`, jobData, {
          headers: { 'X-User-ID': authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error updating job listing:', error.message);
      throw error;
    }
  }

  async deleteJobListing(data: { jobId: string; authorId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.contentServiceUrl}/api/v1/careers/jobs/${data.jobId}`, {
          headers: { 'X-User-ID': data.authorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error deleting job listing:', error.message);
      throw error;
    }
  }

  async applyForJob(data: { jobId: string; [key: string]: any }) {
    try {
      const { jobId, ...applicationData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.contentServiceUrl}/api/v1/careers/jobs/${jobId}/apply`, applicationData),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error applying for job:', error.message);
      throw error;
    }
  }

  async getJobApplications(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...query } = data;
      const response = await firstValueFrom(
        this.httpService.get(`${this.contentServiceUrl}/api/v1/careers/applications`, {
          params: query,
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting job applications:', error.message);
      throw error;
    }
  }
}

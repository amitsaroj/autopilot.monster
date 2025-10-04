import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MarketplaceService {
  private readonly logger = new Logger(MarketplaceService.name);
  private readonly catalogServiceUrl: string;
  private readonly vendorServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.catalogServiceUrl = this.configService.get<string>('CATALOG_SERVICE_URL', 'http://localhost:3003');
    this.vendorServiceUrl = this.configService.get<string>('VENDOR_SERVICE_URL', 'http://localhost:3006');
  }

  async getProducts(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/api/v1/catalog/products`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting products:', error.message);
      throw error;
    }
  }

  async getProduct(data: { productId: string; userId?: string }) {
    try {
      const headers = data.userId ? { 'X-User-ID': data.userId } : {};
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/api/v1/catalog/products/${data.productId}`, { headers }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting product:', error.message);
      throw error;
    }
  }

  async searchProducts(searchData: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.catalogServiceUrl}/api/v1/catalog/search`, searchData),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error searching products:', error.message);
      throw error;
    }
  }

  async getSearchSuggestions(query: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/api/v1/catalog/search/suggestions`, {
          params: { q: query },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting search suggestions:', error.message);
      throw error;
    }
  }

  async getFeaturedProducts(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/api/v1/catalog/products/featured`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting featured products:', error.message);
      throw error;
    }
  }

  async getTrendingProducts(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/api/v1/catalog/products/trending`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting trending products:', error.message);
      throw error;
    }
  }

  async getCategories() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/api/v1/catalog/categories`),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting categories:', error.message);
      throw error;
    }
  }

  async getCategoryProducts(data: { categoryId: string; [key: string]: any }) {
    try {
      const { categoryId, ...query } = data;
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/api/v1/catalog/categories/${categoryId}/products`, {
          params: query,
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting category products:', error.message);
      throw error;
    }
  }

  async getFilters(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/api/v1/catalog/filters`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting filters:', error.message);
      throw error;
    }
  }

  async getProductReviews(data: { productId: string; [key: string]: any }) {
    try {
      const { productId, ...query } = data;
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/api/v1/catalog/products/${productId}/reviews`, {
          params: query,
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting product reviews:', error.message);
      throw error;
    }
  }

  async addProductReview(data: { productId: string; userId: string; [key: string]: any }) {
    try {
      const { productId, userId, ...reviewData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.catalogServiceUrl}/api/v1/catalog/products/${productId}/reviews`, reviewData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error adding product review:', error.message);
      throw error;
    }
  }

  async trackProductView(data: { productId: string; [key: string]: any }) {
    try {
      const { productId, ...trackData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.catalogServiceUrl}/api/v1/catalog/products/${productId}/track-view`, trackData),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error tracking product view:', error.message);
      throw error;
    }
  }

  async trackProductDownload(data: { productId: string; userId: string; [key: string]: any }) {
    try {
      const { productId, userId, ...trackData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.catalogServiceUrl}/api/v1/catalog/products/${productId}/track-download`, trackData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error tracking product download:', error.message);
      throw error;
    }
  }

  async getVendors(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.vendorServiceUrl}/api/v1/vendors`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting vendors:', error.message);
      throw error;
    }
  }

  async getVendor(vendorId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.vendorServiceUrl}/api/v1/vendors/${vendorId}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting vendor:', error.message);
      throw error;
    }
  }

  async getVendorProducts(data: { vendorId: string; [key: string]: any }) {
    try {
      const { vendorId, ...query } = data;
      const response = await firstValueFrom(
        this.httpService.get(`${this.vendorServiceUrl}/api/v1/vendors/${vendorId}/products`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting vendor products:', error.message);
      throw error;
    }
  }

  async getPopularProducts(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/api/v1/catalog/products/popular`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting popular products:', error.message);
      throw error;
    }
  }

  async getRecentProducts(query: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.catalogServiceUrl}/api/v1/catalog/products/recent`, { params: query }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting recent products:', error.message);
      throw error;
    }
  }

  async getMarketplaceStats() {
    try {
      // Combine stats from multiple services
      const [catalogStats, vendorStats] = await Promise.all([
        firstValueFrom(this.httpService.get(`${this.catalogServiceUrl}/api/v1/catalog/stats`)),
        firstValueFrom(this.httpService.get(`${this.vendorServiceUrl}/api/v1/vendors/stats`)),
      ]);

      return {
        products: catalogStats.data,
        vendors: vendorStats.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error getting marketplace stats:', error.message);
      throw error;
    }
  }
}

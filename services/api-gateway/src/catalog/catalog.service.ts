import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface CatalogServiceGrpc {
  getProducts(data: any): Promise<any>;
  getProduct(data: any): Promise<any>;
  createProduct(data: any): Promise<any>;
  updateProduct(data: any): Promise<any>;
  deleteProduct(data: any): Promise<any>;
  searchProducts(data: any): Promise<any>;
  getFeaturedProducts(data: any): Promise<any>;
  getTrendingProducts(data: any): Promise<any>;
  getCategories(data: any): Promise<any>;
  getCategory(data: any): Promise<any>;
  getVendorProducts(data: any): Promise<any>;
  trackProductView(data: any): Promise<any>;
  trackProductDownload(data: any): Promise<any>;
  getProductAnalytics(data: any): Promise<any>;
}

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);
  private catalogService: CatalogServiceGrpc;

  constructor(
    @Inject('CATALOG_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.catalogService = this.client.getService<CatalogServiceGrpc>('CatalogService');
  }

  async getProducts(data: any) {
    try {
      return await this.catalogService.getProducts(data);
    } catch (error) {
      this.logger.error('Get products failed:', error);
      return {
        success: false,
        message: 'Failed to get products',
      };
    }
  }

  async getProduct(data: any) {
    try {
      return await this.catalogService.getProduct(data);
    } catch (error) {
      this.logger.error('Get product failed:', error);
      return {
        success: false,
        message: 'Failed to get product',
      };
    }
  }

  async createProduct(data: any) {
    try {
      return await this.catalogService.createProduct(data);
    } catch (error) {
      this.logger.error('Create product failed:', error);
      return {
        success: false,
        message: 'Failed to create product',
      };
    }
  }

  async updateProduct(data: any) {
    try {
      return await this.catalogService.updateProduct(data);
    } catch (error) {
      this.logger.error('Update product failed:', error);
      return {
        success: false,
        message: 'Failed to update product',
      };
    }
  }

  async deleteProduct(data: any) {
    try {
      return await this.catalogService.deleteProduct(data);
    } catch (error) {
      this.logger.error('Delete product failed:', error);
      return {
        success: false,
        message: 'Failed to delete product',
      };
    }
  }

  async searchProducts(data: any) {
    try {
      return await this.catalogService.searchProducts(data);
    } catch (error) {
      this.logger.error('Search products failed:', error);
      return {
        success: false,
        message: 'Search failed',
      };
    }
  }

  async getFeaturedProducts(data: any) {
    try {
      return await this.catalogService.getFeaturedProducts(data);
    } catch (error) {
      this.logger.error('Get featured products failed:', error);
      return {
        success: false,
        message: 'Failed to get featured products',
      };
    }
  }

  async getTrendingProducts(data: any) {
    try {
      return await this.catalogService.getTrendingProducts(data);
    } catch (error) {
      this.logger.error('Get trending products failed:', error);
      return {
        success: false,
        message: 'Failed to get trending products',
      };
    }
  }

  async getCategories(data: any = {}) {
    try {
      return await this.catalogService.getCategories(data);
    } catch (error) {
      this.logger.error('Get categories failed:', error);
      return {
        success: false,
        message: 'Failed to get categories',
      };
    }
  }

  async getCategory(data: any) {
    try {
      return await this.catalogService.getCategory(data);
    } catch (error) {
      this.logger.error('Get category failed:', error);
      return {
        success: false,
        message: 'Failed to get category',
      };
    }
  }

  async getVendorProducts(data: any) {
    try {
      return await this.catalogService.getVendorProducts(data);
    } catch (error) {
      this.logger.error('Get vendor products failed:', error);
      return {
        success: false,
        message: 'Failed to get vendor products',
      };
    }
  }

  async trackProductView(data: any) {
    try {
      return await this.catalogService.trackProductView(data);
    } catch (error) {
      this.logger.error('Track product view failed:', error);
      return {
        success: false,
        message: 'Failed to track view',
      };
    }
  }

  async trackProductDownload(data: any) {
    try {
      return await this.catalogService.trackProductDownload(data);
    } catch (error) {
      this.logger.error('Track product download failed:', error);
      return {
        success: false,
        message: 'Failed to track download',
      };
    }
  }

  async getProductAnalytics(data: any) {
    try {
      return await this.catalogService.getProductAnalytics(data);
    } catch (error) {
      this.logger.error('Get product analytics failed:', error);
      return {
        success: false,
        message: 'Failed to get analytics',
      };
    }
  }
}

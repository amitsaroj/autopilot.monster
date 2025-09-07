import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Category, CategoryDocument } from '../category/schemas/category.schema';
import { KafkaService } from '../kafka/kafka.service';
import { ElasticsearchService } from '../elasticsearch/elasticsearch.service';
import { RedisService } from '../redis/redis.service';
// import { v4 as uuidv4 } from 'uuid'; // Commented out for now
const uuidv4 = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    private readonly kafkaService: KafkaService,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly redisService: RedisService,
  ) {}

  async createProduct(data: any) {
    try {
      const { vendorId, name, description, shortDescription, type, categoryId, tags, pricing, files, screenshots, metadata } = data;

      // Validate category exists
      const category = await this.categoryModel.findById(categoryId);
      if (!category) {
        return {
          success: false,
          message: 'Category not found',
        };
      }

      // Generate unique slug
      const slug = this.generateSlug(name);
      const existingProduct = await this.productModel.findOne({ slug });
      if (existingProduct) {
        return {
          success: false,
          message: 'Product with this name already exists',
        };
      }

      // Process files
      const processedFiles = files?.map(file => ({
        ...file,
        id: uuidv4(),
      })) || [];

      // Create product
      const product = new this.productModel({
        vendorId,
        name,
        description,
        shortDescription,
        slug,
        type,
        categoryId: new Types.ObjectId(categoryId),
        tags: tags || [],
        pricing: {
          type: pricing.type,
          price: pricing.price || 0,
          discountPrice: pricing.discountPrice,
          discountUntil: pricing.discountUntil,
          currency: pricing.currency || 'USD',
          tiers: pricing.tiers || [],
        },
        files: processedFiles,
        screenshots: screenshots || [],
        metadata: {
          version: metadata?.version || '1.0.0',
          compatibility: metadata?.compatibility || [],
          requirements: metadata?.requirements || [],
          documentationUrl: metadata?.documentationUrl,
          demoUrl: metadata?.demoUrl,
          githubUrl: metadata?.githubUrl,
          customFields: new Map(Object.entries(metadata?.customFields || {})),
        },
        stats: {
          totalViews: 0,
          totalDownloads: 0,
          totalPurchases: 0,
          averageRating: 0,
          totalReviews: 0,
          viewsLast30Days: 0,
          downloadsLast30Days: 0,
        },
      });

      await product.save();

      // Index in Elasticsearch
      await this.indexProductInElasticsearch(product);

      // Publish event
      await this.kafkaService.publishProductEvent('product.created', product._id.toString(), {
        vendorId,
        name,
        type,
        categoryId,
        pricing: pricing.price,
      });

      this.logger.log(`Product created: ${product.name} by vendor: ${vendorId}`);

      return {
        success: true,
        message: 'Product created successfully',
        productId: product._id.toString(),
      };
    } catch (error) {
      this.logger.error('Create product failed:', error);
      return {
        success: false,
        message: error.message || 'Failed to create product',
      };
    }
  }

  async getProduct(data: any) {
    try {
      const { productId, userId } = data;

      const product = await this.productModel
        .findById(productId)
        .populate('categoryId')
        .lean();

      if (!product) {
        return {
          success: false,
          message: 'Product not found',
        };
      }

      // Check if user has purchased this product
      const isPurchased = userId ? await this.checkIfProductPurchased(userId, productId) : false;

      // Get analytics for the product
      const analytics = await this.getProductAnalyticsData(productId);

      return {
        success: true,
        product: this.formatProduct(product),
        isPurchased,
        analytics,
      };
    } catch (error) {
      this.logger.error('Get product failed:', error);
      return {
        success: false,
        message: 'Failed to get product',
      };
    }
  }

  async updateProduct(data: any) {
    try {
      const { productId, vendorId, name, description, shortDescription, categoryId, tags, pricing, files, screenshots, metadata } = data;

      const product = await this.productModel.findById(productId);
      if (!product) {
        return {
          success: false,
          message: 'Product not found',
        };
      }

      // Verify ownership
      if (product.vendorId !== vendorId) {
        return {
          success: false,
          message: 'Unauthorized: You can only update your own products',
        };
      }

      // Update fields
      if (name !== undefined) {
        product.name = name;
        product.slug = this.generateSlug(name);
      }
      if (description !== undefined) product.description = description;
      if (shortDescription !== undefined) product.shortDescription = shortDescription;
      if (categoryId !== undefined) product.categoryId = new Types.ObjectId(categoryId);
      if (tags !== undefined) product.tags = tags;
      if (pricing !== undefined) {
        product.pricing = {
          type: pricing.type,
          price: pricing.price,
          discountPrice: pricing.discountPrice,
          discountUntil: pricing.discountUntil,
          currency: pricing.currency || 'USD',
          tiers: pricing.tiers || [],
        };
      }
      if (files !== undefined) product.files = files;
      if (screenshots !== undefined) product.screenshots = screenshots;
      if (metadata !== undefined) {
        product.metadata = {
          version: metadata.version || product.metadata.version,
          compatibility: metadata.compatibility || product.metadata.compatibility,
          requirements: metadata.requirements || product.metadata.requirements,
          documentationUrl: metadata.documentationUrl,
          demoUrl: metadata.demoUrl,
          githubUrl: metadata.githubUrl,
          customFields: new Map(Object.entries(metadata.customFields || {})),
        };
      }

      await product.save();

      // Update in Elasticsearch
      await this.indexProductInElasticsearch(product);

      // Publish event
      await this.kafkaService.publishProductEvent('product.updated', productId, {
        vendorId,
        changes: Object.keys(data).filter(key => key !== 'productId' && key !== 'vendorId'),
      });

      this.logger.log(`Product updated: ${product.name}`);

      return {
        success: true,
        message: 'Product updated successfully',
        product: this.formatProduct(product),
      };
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
      const { productId, vendorId, reason } = data;

      const product = await this.productModel.findById(productId);
      if (!product) {
        return {
          success: false,
          message: 'Product not found',
        };
      }

      // Verify ownership
      if (product.vendorId !== vendorId) {
        return {
          success: false,
          message: 'Unauthorized: You can only delete your own products',
        };
      }

      // Soft delete by updating status
      product.status = 'PRODUCT_STATUS_ARCHIVED';
      await product.save();

      // Remove from Elasticsearch
      await this.removeProductFromElasticsearch(productId);

      // Publish event
      await this.kafkaService.publishProductEvent('product.deleted', productId, {
        vendorId,
        productName: product.name,
        reason,
      });

      this.logger.log(`Product deleted: ${product.name}`);

      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      this.logger.error('Delete product failed:', error);
      return {
        success: false,
        message: 'Failed to delete product',
      };
    }
  }

  async getProducts(data: any) {
    try {
      const { page = 1, limit = 10, categoryId, type, status, priceRange, sortBy = 'createdAt', sortOrder = 'desc' } = data;

      const query: any = {};
      
      if (categoryId) query.categoryId = new Types.ObjectId(categoryId);
      if (type && type !== 'PRODUCT_TYPE_UNSPECIFIED') query.type = type;
      if (status && status !== 'PRODUCT_STATUS_UNSPECIFIED') query.status = status;
      if (priceRange) {
        query['pricing.price'] = {
          $gte: priceRange.minPrice || 0,
          $lte: priceRange.maxPrice || Number.MAX_SAFE_INTEGER,
        };
      }

      const sort: any = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

      const total = await this.productModel.countDocuments(query);
      const products = await this.productModel
        .find(query)
        .populate('categoryId')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      return {
        success: true,
        products: products.map(product => this.formatProduct(product)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Get products failed:', error);
      return {
        success: false,
        message: 'Failed to get products',
      };
    }
  }

  async searchProducts(data: any) {
    try {
      const { query, page = 1, limit = 10, categories, types, priceRange, tags, minRating } = data;

      // Use Elasticsearch for search if available
      if (this.elasticsearchService) {
        return await this.searchProductsWithElasticsearch(data);
      }

      // Fallback to MongoDB text search
      const searchQuery: any = {};
      
      if (query) {
        searchQuery.$text = { $search: query };
      }
      
      if (categories && categories.length > 0) {
        searchQuery.categoryId = { $in: categories.map(id => new Types.ObjectId(id)) };
      }
      
      if (types && types.length > 0) {
        searchQuery.type = { $in: types };
      }
      
      if (priceRange) {
        searchQuery['pricing.price'] = {
          $gte: priceRange.minPrice || 0,
          $lte: priceRange.maxPrice || Number.MAX_SAFE_INTEGER,
        };
      }
      
      if (tags && tags.length > 0) {
        searchQuery.tags = { $in: tags };
      }
      
      if (minRating) {
        searchQuery['stats.averageRating'] = { $gte: minRating };
      }

      const total = await this.productModel.countDocuments(searchQuery);
      const products = await this.productModel
        .find(searchQuery)
        .populate('categoryId')
        .sort({ score: { $meta: 'textScore' }, 'stats.averageRating': -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      return {
        success: true,
        products: products.map(product => this.formatProduct(product)),
        total,
        page,
        limit,
        facets: [], // Could implement faceted search here
      };
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
      const { limit = 10, type } = data;

      const query: any = {
        isFeatured: true,
        status: 'PRODUCT_STATUS_APPROVED',
      };
      
      if (type && type !== 'PRODUCT_TYPE_UNSPECIFIED') {
        query.type = type;
      }

      const products = await this.productModel
        .find(query)
        .populate('categoryId')
        .sort({ 'stats.averageRating': -1, 'stats.totalViews': -1 })
        .limit(limit)
        .lean();

      return {
        success: true,
        products: products.map(product => this.formatProduct(product)),
      };
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
      const { limit = 10, type, days = 7 } = data;

      const query: any = {
        status: 'PRODUCT_STATUS_APPROVED',
        'stats.viewsLast30Days': { $gt: 0 },
      };
      
      if (type && type !== 'PRODUCT_TYPE_UNSPECIFIED') {
        query.type = type;
      }

      const products = await this.productModel
        .find(query)
        .populate('categoryId')
        .sort({ 'stats.viewsLast30Days': -1, 'stats.downloadsLast30Days': -1 })
        .limit(limit)
        .lean();

      return {
        success: true,
        products: products.map(product => this.formatProduct(product)),
      };
    } catch (error) {
      this.logger.error('Get trending products failed:', error);
      return {
        success: false,
        message: 'Failed to get trending products',
      };
    }
  }

  async getVendorProducts(data: any) {
    try {
      const { vendorId, page = 1, limit = 10, status } = data;

      const query: any = { vendorId };
      if (status && status !== 'PRODUCT_STATUS_UNSPECIFIED') {
        query.status = status;
      }

      const total = await this.productModel.countDocuments(query);
      const products = await this.productModel
        .find(query)
        .populate('categoryId')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      return {
        success: true,
        products: products.map(product => this.formatProduct(product)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Get vendor products failed:', error);
      return {
        success: false,
        message: 'Failed to get vendor products',
      };
    }
  }

  async updateProductStatus(data: any) {
    try {
      const { productId, status, reason, adminId } = data;

      const product = await this.productModel.findById(productId);
      if (!product) {
        return {
          success: false,
          message: 'Product not found',
        };
      }

      const oldStatus = product.status;
      product.status = status;
      await product.save();

      // Update in Elasticsearch
      await this.indexProductInElasticsearch(product);

      // Publish event
      await this.kafkaService.publishProductEvent('product.status_changed', productId, {
        vendorId: product.vendorId,
        oldStatus,
        newStatus: status,
        reason,
        adminId,
      });

      this.logger.log(`Product status updated: ${product.name} -> ${status}`);

      return {
        success: true,
        message: 'Product status updated successfully',
      };
    } catch (error) {
      this.logger.error('Update product status failed:', error);
      return {
        success: false,
        message: 'Failed to update product status',
      };
    }
  }

  async getProductAnalytics(data: any) {
    try {
      const { productId, vendorId, startDate, endDate } = data;

      const product = await this.productModel.findById(productId);
      if (!product) {
        return {
          success: false,
          message: 'Product not found',
        };
      }

      // Verify ownership
      if (vendorId && product.vendorId !== vendorId) {
        return {
          success: false,
          message: 'Unauthorized',
        };
      }

      const analytics = await this.getProductAnalyticsData(productId, startDate, endDate);

      return {
        success: true,
        analytics,
      };
    } catch (error) {
      this.logger.error('Get product analytics failed:', error);
      return {
        success: false,
        message: 'Failed to get analytics',
      };
    }
  }

  async trackProductView(data: any) {
    try {
      const { productId, userId, ipAddress, userAgent } = data;

      // Update product stats
      await this.productModel.findByIdAndUpdate(productId, {
        $inc: { 
          'stats.totalViews': 1,
          'stats.viewsLast30Days': 1 
        }
      });

      // Store view event for analytics
      await this.storeAnalyticsEvent('view', productId, { userId, ipAddress, userAgent });

      return { success: true };
    } catch (error) {
      this.logger.error('Track product view failed:', error);
      return { success: false };
    }
  }

  async trackProductDownload(data: any) {
    try {
      const { productId, userId, fileId } = data;

      // Update product stats
      await this.productModel.findByIdAndUpdate(productId, {
        $inc: { 
          'stats.totalDownloads': 1,
          'stats.downloadsLast30Days': 1 
        }
      });

      // Update file download count
      await this.productModel.updateOne(
        { _id: productId, 'files.id': fileId },
        { $inc: { 'files.$.downloadCount': 1 } }
      );

      // Store download event
      await this.storeAnalyticsEvent('download', productId, { userId, fileId });

      // Publish event
      await this.kafkaService.publishProductEvent('product.downloaded', productId, {
        userId,
        fileId,
      });

      return { success: true };
    } catch (error) {
      this.logger.error('Track product download failed:', error);
      return { success: false };
    }
  }

  // Helper methods
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private formatProduct(product: any) {
    return {
      id: product._id?.toString() || product.id,
      vendorId: product.vendorId,
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      slug: product.slug,
      type: product.type,
      categoryId: product.categoryId?._id?.toString() || product.categoryId,
      category: product.categoryId?.name ? {
        id: product.categoryId._id.toString(),
        name: product.categoryId.name,
        slug: product.categoryId.slug,
      } : null,
      tags: product.tags,
      pricing: product.pricing,
      files: product.files,
      screenshots: product.screenshots,
      status: product.status,
      metadata: product.metadata,
      stats: product.stats,
      isFeatured: product.isFeatured,
      isPromoted: product.isPromoted,
      promotedUntil: product.promotedUntil,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private async indexProductInElasticsearch(product: ProductDocument) {
    if (!this.elasticsearchService) return;

    try {
      await this.elasticsearchService.indexProduct(product);
    } catch (error) {
      this.logger.error('Failed to index product in Elasticsearch:', error);
    }
  }

  private async removeProductFromElasticsearch(productId: string) {
    if (!this.elasticsearchService) return;

    try {
      await this.elasticsearchService.deleteProduct(productId);
    } catch (error) {
      this.logger.error('Failed to remove product from Elasticsearch:', error);
    }
  }

  private async searchProductsWithElasticsearch(data: any) {
    // Implementation for Elasticsearch search
    return {
      success: true,
      products: [],
      total: 0,
      page: data.page || 1,
      limit: data.limit || 10,
      facets: [],
    };
  }

  private async checkIfProductPurchased(userId: string, productId: string): Promise<boolean> {
    // This would check with the payment service
    // For now, return false
    return false;
  }

  private async getProductAnalyticsData(productId: string, startDate?: number, endDate?: number) {
    // Implementation for detailed analytics
    return {
      totalViews: 0,
      totalDownloads: 0,
      totalPurchases: 0,
      totalRevenue: 0,
      dailyStats: [],
      countryStats: [],
      topReferrers: [],
    };
  }

  private async storeAnalyticsEvent(eventType: string, productId: string, data: any) {
    try {
      const event = {
        eventType,
        productId,
        timestamp: new Date().toISOString(),
        ...data,
      };

      // Store in Redis for real-time analytics
      await this.redisService.lPush(`analytics:${productId}`, event);

      // Publish to Kafka for long-term storage
      await this.kafkaService.publishAnalyticsEvent(eventType, { productId, ...data });
    } catch (error) {
      this.logger.error('Failed to store analytics event:', error);
    }
  }
}

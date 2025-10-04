import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ElasticsearchService.name);
  private client: Client;

  constructor(private configService: ConfigService) {
    this.client = new Client({
      node: this.configService.get('elasticsearch.node', 'http://localhost:9200'),
      auth: {
        username: this.configService.get('elasticsearch.username', 'elastic'),
        password: this.configService.get('elasticsearch.password', 'changeme'),
      },
    });
  }

  async onModuleInit() {
    try {
      await this.client.ping();
      this.logger.log('Connected to Elasticsearch');
      await this.createIndexes();
    } catch (error) {
      this.logger.error('Failed to connect to Elasticsearch:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.close();
      this.logger.log('Disconnected from Elasticsearch');
    } catch (error) {
      this.logger.error('Failed to disconnect from Elasticsearch:', error);
    }
  }

  async createIndexes() {
    try {
      // Create products index
      const productsIndexExists = await this.client.indices.exists({
        index: 'products',
      });

      if (!productsIndexExists) {
        await this.client.indices.create({
          index: 'products',
          body: {
            mappings: {
              properties: {
                id: { type: 'keyword' },
                vendorId: { type: 'keyword' },
                name: { 
                  type: 'text',
                  analyzer: 'standard',
                  fields: {
                    keyword: { type: 'keyword' }
                  }
                },
                description: { 
                  type: 'text',
                  analyzer: 'standard'
                },
                shortDescription: { 
                  type: 'text',
                  analyzer: 'standard'
                },
                slug: { type: 'keyword' },
                type: { type: 'keyword' },
                categoryId: { type: 'keyword' },
                categoryName: { type: 'keyword' },
                tags: { type: 'keyword' },
                pricing: {
                  properties: {
                    type: { type: 'keyword' },
                    price: { type: 'float' },
                    discountPrice: { type: 'float' },
                    currency: { type: 'keyword' }
                  }
                },
                status: { type: 'keyword' },
                isFeatured: { type: 'boolean' },
                isPromoted: { type: 'boolean' },
                stats: {
                  properties: {
                    totalViews: { type: 'long' },
                    totalDownloads: { type: 'long' },
                    totalPurchases: { type: 'long' },
                    averageRating: { type: 'float' },
                    totalReviews: { type: 'long' }
                  }
                },
                createdAt: { type: 'date' },
                updatedAt: { type: 'date' }
              }
            },
            settings: {
              number_of_shards: 1,
              number_of_replicas: 0,
              analysis: {
                analyzer: {
                  custom_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'stop', 'snowball']
                  }
                }
              }
            }
          }
        });
        this.logger.log('Created products index');
      }

      // Create categories index
      const categoriesIndexExists = await this.client.indices.exists({
        index: 'categories',
      });

      if (!categoriesIndexExists) {
        await this.client.indices.create({
          index: 'categories',
          body: {
            mappings: {
              properties: {
                id: { type: 'keyword' },
                name: { 
                  type: 'text',
                  analyzer: 'standard',
                  fields: {
                    keyword: { type: 'keyword' }
                  }
                },
                description: { 
                  type: 'text',
                  analyzer: 'standard'
                },
                slug: { type: 'keyword' },
                parentId: { type: 'keyword' },
                isActive: { type: 'boolean' },
                sortOrder: { type: 'integer' },
                createdAt: { type: 'date' },
                updatedAt: { type: 'date' }
              }
            }
          }
        });
        this.logger.log('Created categories index');
      }
    } catch (error) {
      this.logger.error('Failed to create indexes:', error);
    }
  }

  async indexProduct(product: any) {
    try {
      await this.client.index({
        index: 'products',
        id: product._id.toString(),
        body: {
          id: product._id.toString(),
          vendorId: product.vendorId,
          name: product.name,
          description: product.description,
          shortDescription: product.shortDescription,
          slug: product.slug,
          type: product.type,
          categoryId: product.categoryId?.toString(),
          categoryName: product.categoryId?.name,
          tags: product.tags,
          pricing: product.pricing,
          status: product.status,
          isFeatured: product.isFeatured,
          isPromoted: product.isPromoted,
          stats: product.stats,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        }
      });
      this.logger.log(`Indexed product: ${product.name}`);
    } catch (error) {
      this.logger.error('Failed to index product:', error);
    }
  }

  async indexCategory(category: any) {
    try {
      await this.client.index({
        index: 'categories',
        id: category._id.toString(),
        body: {
          id: category._id.toString(),
          name: category.name,
          description: category.description,
          slug: category.slug,
          parentId: category.parentId?.toString(),
          isActive: category.isActive,
          sortOrder: category.sortOrder,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        }
      });
      this.logger.log(`Indexed category: ${category.name}`);
    } catch (error) {
      this.logger.error('Failed to index category:', error);
    }
  }

  async deleteProduct(productId: string) {
    try {
      await this.client.delete({
        index: 'products',
        id: productId
      });
      this.logger.log(`Deleted product from index: ${productId}`);
    } catch (error) {
      this.logger.error('Failed to delete product from index:', error);
    }
  }

  async deleteCategory(categoryId: string) {
    try {
      await this.client.delete({
        index: 'categories',
        id: categoryId
      });
      this.logger.log(`Deleted category from index: ${categoryId}`);
    } catch (error) {
      this.logger.error('Failed to delete category from index:', error);
    }
  }

  async searchProducts(query: string, filters: any = {}, page: number = 1, limit: number = 10) {
    try {
      const searchBody: any = {
        query: {
          bool: {
            must: [],
            filter: []
          }
        },
        sort: [
          { 'stats.averageRating': { order: 'desc' } },
          { 'stats.totalViews': { order: 'desc' } }
        ],
        from: (page - 1) * limit,
        size: limit,
        highlight: {
          fields: {
            name: {},
            description: {},
            shortDescription: {}
          }
        }
      };

      // Add text search
      if (query) {
        searchBody.query.bool.must.push({
          multi_match: {
            query,
            fields: ['name^3', 'description^2', 'shortDescription', 'tags'],
            type: 'best_fields',
            fuzziness: 'AUTO'
          }
        });
      } else {
        searchBody.query.bool.must.push({ match_all: {} });
      }

      // Add filters
      if (filters.categories && filters.categories.length > 0) {
        searchBody.query.bool.filter.push({
          terms: { categoryId: filters.categories }
        });
      }

      if (filters.types && filters.types.length > 0) {
        searchBody.query.bool.filter.push({
          terms: { type: filters.types }
        });
      }

      if (filters.tags && filters.tags.length > 0) {
        searchBody.query.bool.filter.push({
          terms: { tags: filters.tags }
        });
      }

      if (filters.priceRange) {
        searchBody.query.bool.filter.push({
          range: {
            'pricing.price': {
              gte: filters.priceRange.minPrice || 0,
              lte: filters.priceRange.maxPrice || Number.MAX_SAFE_INTEGER
            }
          }
        });
      }

      if (filters.minRating) {
        searchBody.query.bool.filter.push({
          range: {
            'stats.averageRating': {
              gte: filters.minRating
            }
          }
        });
      }

      // Only show approved products
      searchBody.query.bool.filter.push({
        term: { status: 'PRODUCT_STATUS_APPROVED' }
      });

      const response = await this.client.search({
        index: 'products',
        body: searchBody
      });

      const products = response.hits.hits.map((hit: any) => ({
        ...hit._source,
        score: hit._score,
        highlights: hit.highlight
      }));

      // Get aggregations for faceted search
      const aggregations = response.aggregations || {};

      return {
        products,
        total: typeof response.hits.total === 'number' ? response.hits.total : response.hits.total.value,
        page,
        limit,
        facets: {
          categories: (aggregations.categories as any)?.buckets || [],
          types: (aggregations.types as any)?.buckets || [],
          tags: (aggregations.tags as any)?.buckets || [],
          priceRanges: (aggregations.priceRanges as any)?.buckets || []
        }
      };
    } catch (error) {
      this.logger.error('Search products failed:', error);
      throw error;
    }
  }

  async searchCategories(query: string, parentId?: string) {
    try {
      const searchBody: any = {
        query: {
          bool: {
            must: [
              { term: { isActive: true } }
            ]
          }
        },
        sort: [
          { sortOrder: { order: 'asc' } },
          { name: { order: 'asc' } }
        ]
      };

      if (query) {
        searchBody.query.bool.must.push({
          multi_match: {
            query,
            fields: ['name^2', 'description'],
            type: 'best_fields'
          }
        });
      }

      if (parentId) {
        searchBody.query.bool.must.push({
          term: { parentId }
        });
      }

      const response = await this.client.search({
        index: 'categories',
        body: searchBody
      });

      return response.hits.hits.map((hit: any) => hit._source);
    } catch (error) {
      this.logger.error('Search categories failed:', error);
      throw error;
    }
  }

  async getSuggestions(query: string, type: 'products' | 'categories' = 'products') {
    try {
      const response = await this.client.search({
        index: type,
        body: {
          suggest: {
            name_suggest: {
              prefix: query,
              completion: {
                field: 'name_suggest',
                size: 10
              }
            }
          }
        }
      });

      return (response.suggest.name_suggest[0].options as any[]).map((option: any) => ({
        text: option.text,
        score: option._score
      }));
    } catch (error) {
      this.logger.error('Get suggestions failed:', error);
      return [];
    }
  }

  async getPopularSearches(limit: number = 10) {
    try {
      // This would typically come from a separate analytics index
      // For now, return empty array
      return [];
    } catch (error) {
      this.logger.error('Get popular searches failed:', error);
      return [];
    }
  }

  async getSearchAnalytics(startDate: Date, endDate: Date) {
    try {
      // Implementation for search analytics
      return {
        totalSearches: 0,
        uniqueQueries: 0,
        topQueries: [],
        searchTrends: []
      };
    } catch (error) {
      this.logger.error('Get search analytics failed:', error);
      return null;
    }
  }
}

# Code Examples & Snippets - Autopilot.monster

## 🎯 Overview

This document provides ready-to-use code examples, snippets, and templates for building the Autopilot.monster marketplace. All examples follow production-ready standards with proper error handling, type safety, and performance optimization.

## 🎨 Frontend Components

### 1. Animated Product Card

```typescript
// components/ui/ProductCard/ProductCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Download, ShoppingCart } from 'lucide-react';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';
import styles from './ProductCard.module.scss';

interface Product {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  pricing: {
    type: 'free' | 'one-time' | 'subscription';
    amount?: number;
    currency: string;
  };
  stats: {
    downloads: number;
    rating: number;
    reviewCount: number;
  };
  vendor: {
    name: string;
    avatar: string;
  };
  type: 'ai-agent' | 'n8n-workflow' | 'automation-asset';
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
}) => {
  const formatPrice = (pricing: Product['pricing']) => {
    if (pricing.type === 'free') return 'Free';
    if (pricing.type === 'subscription') {
      return `$${pricing.amount}/mo`;
    }
    return `$${pricing.amount}`;
  };

  const formatDownloads = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <motion.div
      className={styles.card}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
      layout
    >
      <div className={styles.imageContainer}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.thumbnail}
          loading="lazy"
        />
        <div className={styles.overlay}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onQuickView?.(product.id)}
            className={styles.quickViewBtn}
          >
            Quick View
          </Button>
        </div>
        <Badge
          variant={product.type === 'ai-agent' ? 'primary' : product.type === 'n8n-workflow' ? 'secondary' : 'accent'}
          className={styles.typeBadge}
        >
          {product.type.replace('-', ' ').toUpperCase()}
        </Badge>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{product.title}</h3>
          <div className={styles.pricing}>
            <span className={styles.price}>{formatPrice(product.pricing)}</span>
          </div>
        </div>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <Star className={styles.icon} size={16} />
            <span>{product.stats.rating.toFixed(1)}</span>
            <span className={styles.count}>({product.stats.reviewCount})</span>
          </div>
          <div className={styles.stat}>
            <Download className={styles.icon} size={16} />
            <span>{formatDownloads(product.stats.downloads)}</span>
          </div>
        </div>

        <div className={styles.vendor}>
          <img
            src={product.vendor.avatar}
            alt={product.vendor.name}
            className={styles.vendorAvatar}
          />
          <span className={styles.vendorName}>{product.vendor.name}</span>
        </div>

        <div className={styles.actions}>
          <Button
            variant="primary"
            fullWidth
            onClick={() => onAddToCart?.(product.id)}
            leftIcon={<ShoppingCart size={16} />}
          >
            {product.pricing.type === 'free' ? 'Download' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
```

```scss
// components/ui/ProductCard/ProductCard.module.scss
@import '../../../styles/settings/variables';
@import '../../../styles/tools/mixins';

.card {
  @include shadow-md;
  background: var(--color-bg-primary);
  border-radius: $radius-lg;
  overflow: hidden;
  transition: all $duration-normal $ease-out;
  border: 1px solid var(--color-border-primary);
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    @include shadow-lg;
    border-color: $color-primary-300;
  }
}

.imageContainer {
  position: relative;
  height: 200px;
  overflow: hidden;

  .thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform $duration-normal $ease-out;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    @include flex-center;
    opacity: 0;
    transition: opacity $duration-normal $ease-out;
  }

  .typeBadge {
    position: absolute;
    top: $space-3;
    left: $space-3;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
  }

  &:hover {
    .thumbnail {
      transform: scale(1.05);
    }

    .overlay {
      opacity: 1;
    }
  }
}

.content {
  padding: $space-4;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: $space-3;
}

.header {
  @include flex-between;
  align-items: flex-start;
}

.title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: var(--color-text-primary);
  margin: 0;
  @include line-clamp(2);
}

.pricing {
  .price {
    font-size: $font-size-lg;
    font-weight: $font-weight-bold;
    color: $color-primary-600;
  }
}

.description {
  color: var(--color-text-secondary);
  font-size: $font-size-sm;
  line-height: $line-height-relaxed;
  @include line-clamp(3);
  margin: 0;
}

.stats {
  display: flex;
  gap: $space-4;
  align-items: center;

  .stat {
    display: flex;
    align-items: center;
    gap: $space-1;
    font-size: $font-size-sm;
    color: var(--color-text-secondary);

    .icon {
      color: $color-warning;
    }

    .count {
      color: var(--color-text-tertiary);
    }
  }
}

.vendor {
  display: flex;
  align-items: center;
  gap: $space-2;

  .vendorAvatar {
    width: 24px;
    height: 24px;
    border-radius: $radius-full;
    object-fit: cover;
  }

  .vendorName {
    font-size: $font-size-sm;
    color: var(--color-text-secondary);
    font-weight: $font-weight-medium;
  }
}

.actions {
  margin-top: auto;
}

.quickViewBtn {
  color: $text-inverse;
  border-color: rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.5);
  }
}
```

### 2. Search and Filter Component

```typescript
// components/features/SearchFilters/SearchFilters.tsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import { Select } from '../../ui/Select/Select';
import { Checkbox } from '../../ui/Checkbox/Checkbox';
import { Slider } from '../../ui/Slider/Slider';
import styles from './SearchFilters.module.scss';

interface FilterState {
  search: string;
  category: string;
  type: string[];
  priceRange: [number, number];
  rating: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: Array<{ value: string; label: string }>;
  loading?: boolean;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  loading = false,
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['type', 'price', 'rating'])
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, search: value });
    },
    [filters, onFiltersChange]
  );

  const handleTypeChange = useCallback(
    (type: string, checked: boolean) => {
      const newTypes = checked
        ? [...filters.type, type]
        : filters.type.filter(t => t !== type);
      onFiltersChange({ ...filters, type: newTypes });
    },
    [filters, onFiltersChange]
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: '',
      type: [],
      priceRange: [0, 1000],
      rating: 0,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  };

  const activeFilterCount = [
    filters.category,
    filters.type.length > 0 && filters.type,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 1000,
    filters.rating > 0,
  ].filter(Boolean).length;

  return (
    <div className={styles.container}>
      {/* Search Bar */}
      <div className={styles.searchBar}>
        <div className={styles.searchInput}>
          <Input
            placeholder="Search AI agents, workflows, and tools..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            leftIcon={<Search size={20} />}
            className={styles.input}
          />
        </div>

        <div className={styles.sortControls}>
          <Select
            value={filters.sortBy}
            onChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
            options={[
              { value: 'createdAt', label: 'Newest' },
              { value: 'downloads', label: 'Most Downloaded' },
              { value: 'rating', label: 'Highest Rated' },
              { value: 'pricing.amount', label: 'Price' },
              { value: 'title', label: 'Name' },
            ]}
            className={styles.sortSelect}
          />
        </div>

        <Button
          variant="outline"
          onClick={() => setShowMobileFilters(true)}
          className={styles.mobileFilterBtn}
          leftIcon={<Filter size={16} />}
        >
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className={styles.desktopFilters}>
        <div className={styles.filtersContent}>
          {/* Category Filter */}
          <div className={styles.filterSection}>
            <h3 className={styles.filterTitle}>Category</h3>
            <Select
              value={filters.category}
              onChange={(value) => onFiltersChange({ ...filters, category: value })}
              options={[
                { value: '', label: 'All Categories' },
                ...categories,
              ]}
              className={styles.categorySelect}
            />
          </div>

          {/* Type Filter */}
          <div className={styles.filterSection}>
            <button
              className={styles.filterToggle}
              onClick={() => toggleSection('type')}
            >
              <h3 className={styles.filterTitle}>Type</h3>
              <ChevronDown
                className={`${styles.chevron} ${
                  expandedSections.has('type') ? styles.expanded : ''
                }`}
                size={16}
              />
            </button>
            <AnimatePresence>
              {expandedSections.has('type') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={styles.filterContent}
                >
                  {['ai-agent', 'n8n-workflow', 'automation-asset'].map((type) => (
                    <Checkbox
                      key={type}
                      checked={filters.type.includes(type)}
                      onChange={(checked) => handleTypeChange(type, checked)}
                      label={type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Price Range Filter */}
          <div className={styles.filterSection}>
            <button
              className={styles.filterToggle}
              onClick={() => toggleSection('price')}
            >
              <h3 className={styles.filterTitle}>Price Range</h3>
              <ChevronDown
                className={`${styles.chevron} ${
                  expandedSections.has('price') ? styles.expanded : ''
                }`}
                size={16}
              />
            </button>
            <AnimatePresence>
              {expandedSections.has('price') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={styles.filterContent}
                >
                  <Slider
                    min={0}
                    max={1000}
                    step={10}
                    value={filters.priceRange}
                    onChange={(value) =>
                      onFiltersChange({ ...filters, priceRange: value as [number, number] })
                    }
                    formatLabel={(value) => `$${value}`}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Rating Filter */}
          <div className={styles.filterSection}>
            <button
              className={styles.filterToggle}
              onClick={() => toggleSection('rating')}
            >
              <h3 className={styles.filterTitle}>Minimum Rating</h3>
              <ChevronDown
                className={`${styles.chevron} ${
                  expandedSections.has('rating') ? styles.expanded : ''
                }`}
                size={16}
              />
            </button>
            <AnimatePresence>
              {expandedSections.has('rating') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={styles.filterContent}
                >
                  {[4, 3, 2, 1].map((rating) => (
                    <div
                      key={rating}
                      className={`${styles.ratingOption} ${
                        filters.rating === rating ? styles.selected : ''
                      }`}
                      onClick={() => onFiltersChange({ ...filters, rating })}
                    >
                      <span>{rating}+ Stars</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className={styles.clearFilters}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            className={styles.mobileFiltersOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              className={styles.mobileFiltersContent}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.mobileFiltersHeader}>
                <h2>Filters</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X size={20} />
                </Button>
              </div>
              {/* Mobile filters content (similar to desktop) */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
```

## 🔧 Backend Service Examples

### 1. Complete NestJS Service Template

```typescript
// services/catalog-service/src/catalog.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto, SearchProductsDto } from './dto';
import { EventService } from '../events/event.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class CatalogService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private eventService: EventService,
    private cacheService: CacheService,
  ) {}

  async create(createProductDto: CreateProductDto, userId: string): Promise<Product> {
    try {
      // Check if product with same title exists for this vendor
      const existingProduct = await this.productModel.findOne({
        title: createProductDto.title,
        vendorId: userId,
      });

      if (existingProduct) {
        throw new ConflictException('Product with this title already exists');
      }

      // Create product
      const product = new this.productModel({
        ...createProductDto,
        vendorId: userId,
        status: 'draft',
        stats: {
          downloads: 0,
          rating: 0,
          reviewCount: 0,
        },
      });

      const savedProduct = await product.save();

      // Emit event
      await this.eventService.publish('product.created', {
        productId: savedProduct._id.toString(),
        vendorId: userId,
        title: savedProduct.title,
        type: savedProduct.type,
      });

      // Invalidate cache
      await this.cacheService.del('products:*');

      return savedProduct;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create product');
    }
  }

  async findAll(searchDto: SearchProductsDto): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 20,
      category,
      type,
      priceMin,
      priceMax,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      rating,
    } = searchDto;

    // Generate cache key
    const cacheKey = `products:${JSON.stringify(searchDto)}`;
    
    // Try to get from cache
    const cached = await this.cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Build query
    const query: any = { status: 'approved' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (category) {
      query.categories = { $in: [category] };
    }

    if (type && type.length > 0) {
      query.type = { $in: type };
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      query['pricing.amount'] = {};
      if (priceMin !== undefined) query['pricing.amount'].$gte = priceMin;
      if (priceMax !== undefined) query['pricing.amount'].$lte = priceMax;
    }

    if (rating && rating > 0) {
      query['stats.rating'] = { $gte: rating };
    }

    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries
    const [products, total] = await Promise.all([
      this.productModel
        .find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('vendorId', 'profile.firstName profile.lastName profile.avatar')
        .lean()
        .exec(),
      this.productModel.countDocuments(query),
    ]);

    const result = {
      products: products as Product[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    // Cache result for 5 minutes
    await this.cacheService.set(cacheKey, JSON.stringify(result), 300);

    return result;
  }

  async findById(id: string): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const cacheKey = `product:${id}`;
    const cached = await this.cacheService.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const product = await this.productModel
      .findById(id)
      .populate('vendorId', 'profile.firstName profile.lastName profile.avatar')
      .lean()
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Cache for 10 minutes
    await this.cacheService.set(cacheKey, JSON.stringify(product), 600);

    return product as Product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    userId: string,
  ): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check ownership
    if (product.vendorId.toString() !== userId) {
      throw new BadRequestException('You can only update your own products');
    }

    // Update product
    Object.assign(product, updateProductDto);
    const updatedProduct = await product.save();

    // Emit event
    await this.eventService.publish('product.updated', {
      productId: id,
      vendorId: userId,
      changes: updateProductDto,
    });

    // Invalidate cache
    await this.cacheService.del(`product:${id}`);
    await this.cacheService.del('products:*');

    return updatedProduct;
  }

  async delete(id: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check ownership
    if (product.vendorId.toString() !== userId) {
      throw new BadRequestException('You can only delete your own products');
    }

    await this.productModel.findByIdAndDelete(id);

    // Emit event
    await this.eventService.publish('product.deleted', {
      productId: id,
      vendorId: userId,
      title: product.title,
    });

    // Invalidate cache
    await this.cacheService.del(`product:${id}`);
    await this.cacheService.del('products:*');
  }

  async incrementDownloads(id: string): Promise<void> {
    await this.productModel.findByIdAndUpdate(
      id,
      { $inc: { 'stats.downloads': 1 } },
      { new: true },
    );

    // Invalidate cache
    await this.cacheService.del(`product:${id}`);
  }

  async updateRating(id: string, rating: number): Promise<void> {
    const product = await this.productModel.findById(id);
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Recalculate average rating
    const reviews = await this.getProductReviews(id);
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;

    await this.productModel.findByIdAndUpdate(id, {
      'stats.rating': avgRating,
      'stats.reviewCount': reviews.length,
    });

    // Invalidate cache
    await this.cacheService.del(`product:${id}`);
  }

  private async getProductReviews(productId: string): Promise<any[]> {
    // This would typically call the reviews service
    // For now, return empty array
    return [];
  }
}
```

### 2. Authentication Middleware

```typescript
// shared/middleware/src/auth.middleware.ts
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const token = this.extractTokenFromHeader(req);
      
      if (!token) {
        throw new UnauthorizedException('Access token required');
      }

      // Check if token is blacklisted
      const isBlacklisted = await this.redisService.get(`blacklist:${token}`);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }

      // Verify token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // Check if user session is still valid
      const session = await this.redisService.get(`session:${payload.sub}`);
      if (!session) {
        throw new UnauthorizedException('Session expired');
      }

      // Attach user to request
      req.user = {
        id: payload.sub,
        email: payload.email,
        roles: payload.roles || [],
      };

      // Update last activity
      await this.redisService.setex(
        `session:${payload.sub}`,
        3600, // 1 hour
        JSON.stringify({ lastActivity: new Date() }),
      );

      next();
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid access token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

### 3. Event-Driven Payment Processing

```typescript
// services/payment-service/src/payment.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { PaymentIntent, PaymentIntentDocument } from './schemas/payment-intent.schema';
import { EventService } from '../events/event.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectModel(PaymentIntent.name)
    private paymentIntentModel: Model<PaymentIntentDocument>,
    private eventService: EventService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(
    userId: string,
    productId: string,
    amount: number,
    currency: string = 'usd',
  ): Promise<{ clientSecret: string; paymentIntentId: string }> {
    try {
      // Create Stripe payment intent
      const stripePaymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          userId,
          productId,
        },
      });

      // Save payment intent to database
      const paymentIntent = new this.paymentIntentModel({
        userId,
        productId,
        amount,
        currency,
        stripePaymentIntentId: stripePaymentIntent.id,
        status: 'pending',
        metadata: {
          userId,
          productId,
        },
      });

      await paymentIntent.save();

      // Emit event
      await this.eventService.publish('payment.intent.created', {
        paymentIntentId: paymentIntent._id.toString(),
        userId,
        productId,
        amount,
        currency,
      });

      return {
        clientSecret: stripePaymentIntent.client_secret,
        paymentIntentId: paymentIntent._id.toString(),
      };
    } catch (error) {
      throw new BadRequestException('Failed to create payment intent');
    }
  }

  async handleWebhook(signature: string, body: Buffer): Promise<void> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Update payment intent status
    await this.paymentIntentModel.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      {
        status: 'succeeded',
        completedAt: new Date(),
      },
    );

    // Emit success event
    await this.eventService.publish('payment.completed', {
      paymentIntentId: paymentIntent.id,
      userId: paymentIntent.metadata.userId,
      productId: paymentIntent.metadata.productId,
      amount: paymentIntent.amount / 100,
    });
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    // Update payment intent status
    await this.paymentIntentModel.findOneAndUpdate(
      { stripePaymentIntentId: paymentIntent.id },
      {
        status: 'failed',
      },
    );

    // Emit failure event
    await this.eventService.publish('payment.failed', {
      paymentIntentId: paymentIntent.id,
      userId: paymentIntent.metadata.userId,
      productId: paymentIntent.metadata.productId,
      amount: paymentIntent.amount / 100,
      reason: paymentIntent.last_payment_error?.message,
    });
  }
}
```

## 🧪 Testing Examples

### 1. Frontend Component Testing

```typescript
// components/ui/ProductCard/ProductCard.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductCard } from './ProductCard';

const mockProduct = {
  id: '1',
  title: 'AI Customer Support Agent',
  description: 'Intelligent customer support automation',
  thumbnail: '/images/ai-agent-thumbnail.jpg',
  pricing: {
    type: 'one-time' as const,
    amount: 99,
    currency: 'USD',
  },
  stats: {
    downloads: 1250,
    rating: 4.8,
    reviewCount: 125,
  },
  vendor: {
    name: 'AI Solutions Inc.',
    avatar: '/images/vendor-avatar.jpg',
  },
  type: 'ai-agent' as const,
};

const renderWithProviders = (ui: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText('AI Customer Support Agent')).toBeInTheDocument();
    expect(screen.getByText('Intelligent customer support automation')).toBeInTheDocument();
    expect(screen.getByText('$99')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(125)')).toBeInTheDocument();
    expect(screen.getByText('1.3K')).toBeInTheDocument(); // formatted downloads
    expect(screen.getByText('AI Solutions Inc.')).toBeInTheDocument();
  });

  it('calls onAddToCart when add to cart button is clicked', async () => {
    const mockOnAddToCart = jest.fn();
    
    renderWithProviders(
      <ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    await waitFor(() => {
      expect(mockOnAddToCart).toHaveBeenCalledWith('1');
    });
  });

  it('shows "Download" button for free products', () => {
    const freeProduct = {
      ...mockProduct,
      pricing: { type: 'free' as const, currency: 'USD' },
    };

    renderWithProviders(<ProductCard product={freeProduct} />);

    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('calls onQuickView when quick view button is clicked', async () => {
    const mockOnQuickView = jest.fn();
    
    renderWithProviders(
      <ProductCard product={mockProduct} onQuickView={mockOnQuickView} />
    );

    // Hover to show overlay
    const card = screen.getByTestId('product-card');
    fireEvent.mouseEnter(card);

    const quickViewButton = await screen.findByRole('button', { name: /quick view/i });
    fireEvent.click(quickViewButton);

    await waitFor(() => {
      expect(mockOnQuickView).toHaveBeenCalledWith('1');
    });
  });

  it('formats large download numbers correctly', () => {
    const productWithManyDownloads = {
      ...mockProduct,
      stats: { ...mockProduct.stats, downloads: 1500000 },
    };

    renderWithProviders(<ProductCard product={productWithManyDownloads} />);

    expect(screen.getByText('1.5M')).toBeInTheDocument();
  });

  it('applies correct badge variant for product type', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const badge = screen.getByText('AI AGENT');
    expect(badge).toHaveClass('badgePrimary');
  });
});
```

### 2. Backend Integration Testing

```typescript
// services/catalog-service/test/catalog.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppModule } from '../src/app.module';
import { Product, ProductSchema } from '../src/schemas/product.schema';
import { JwtService } from '@nestjs/jwt';

describe('Catalog (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let jwtService: JwtService;
  let authToken: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    
    await app.init();

    // Create auth token for testing
    authToken = jwtService.sign({
      sub: '60f7b3b3b3b3b3b3b3b3b3b3',
      email: 'vendor@example.com',
      roles: ['vendor'],
    });
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  describe('/catalog/products (POST)', () => {
    it('should create a new product', () => {
      const productData = {
        title: 'Test AI Agent',
        description: 'A test AI agent for automation',
        shortDescription: 'Test AI agent',
        type: 'ai-agent',
        categories: ['customer-support'],
        tags: ['ai', 'automation'],
        pricing: {
          type: 'one-time',
          amount: 99,
          currency: 'USD',
        },
        media: {
          thumbnail: '/images/test-thumbnail.jpg',
          screenshots: ['/images/screenshot1.jpg'],
        },
      };

      return request(app.getHttpServer())
        .post('/catalog/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData)
        .expect(201)
        .expect((res) => {
          expect(res.body.title).toBe(productData.title);
          expect(res.body.vendorId).toBe('60f7b3b3b3b3b3b3b3b3b3b3');
          expect(res.body.status).toBe('draft');
        });
    });

    it('should return 401 without auth token', () => {
      return request(app.getHttpServer())
        .post('/catalog/products')
        .send({})
        .expect(401);
    });

    it('should return 400 with invalid data', () => {
      return request(app.getHttpServer())
        .post('/catalog/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: '', // Invalid empty title
        })
        .expect(400);
    });
  });

  describe('/catalog/products (GET)', () => {
    beforeEach(async () => {
      // Create test products
      await request(app.getHttpServer())
        .post('/catalog/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Public AI Agent',
          description: 'A public AI agent',
          shortDescription: 'Public AI agent',
          type: 'ai-agent',
          categories: ['automation'],
          pricing: { type: 'free', currency: 'USD' },
          media: { thumbnail: '/test.jpg', screenshots: [] },
          status: 'approved',
        });
    });

    it('should return paginated products', () => {
      return request(app.getHttpServer())
        .get('/catalog/products')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('products');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('page');
          expect(res.body).toHaveProperty('limit');
          expect(Array.isArray(res.body.products)).toBe(true);
        });
    });

    it('should filter products by search term', () => {
      return request(app.getHttpServer())
        .get('/catalog/products?search=Public')
        .expect(200)
        .expect((res) => {
          expect(res.body.products.length).toBeGreaterThan(0);
          expect(res.body.products[0].title).toContain('Public');
        });
    });

    it('should filter products by type', () => {
      return request(app.getHttpServer())
        .get('/catalog/products?type=ai-agent')
        .expect(200)
        .expect((res) => {
          expect(res.body.products.every(p => p.type === 'ai-agent')).toBe(true);
        });
    });
  });

  describe('/catalog/products/:id (GET)', () => {
    let productId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/catalog/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Product for Retrieval',
          description: 'Test description',
          shortDescription: 'Test',
          type: 'ai-agent',
          categories: ['test'],
          pricing: { type: 'free', currency: 'USD' },
          media: { thumbnail: '/test.jpg', screenshots: [] },
          status: 'approved',
        });
      
      productId = response.body._id;
    });

    it('should return a single product', () => {
      return request(app.getHttpServer())
        .get(`/catalog/products/${productId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(productId);
          expect(res.body.title).toBe('Test Product for Retrieval');
        });
    });

    it('should return 404 for non-existent product', () => {
      return request(app.getHttpServer())
        .get('/catalog/products/60f7b3b3b3b3b3b3b3b3b3b4')
        .expect(404);
    });

    it('should return 400 for invalid product ID', () => {
      return request(app.getHttpServer())
        .get('/catalog/products/invalid-id')
        .expect(400);
    });
  });
});
```

## 🚀 Deployment Scripts

### 1. Complete CI/CD Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: autopilot-monster

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:7.0
        env:
          MONGO_INITDB_ROOT_USERNAME: admin
          MONGO_INITDB_ROOT_PASSWORD: password
        ports:
          - 27017:27017
      
      redis:
        image: redis:7.0-alpine
        ports:
          - 6379:6379

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run unit tests
        run: npm run test:unit
        env:
          NODE_ENV: test
          MONGODB_URI: mongodb://admin:password@localhost:27017/test?authSource=admin
          REDIS_URL: redis://localhost:6379

      - name: Run integration tests
        run: npm run test:integration
        env:
          NODE_ENV: test
          MONGODB_URI: mongodb://admin:password@localhost:27017/test?authSource=admin
          REDIS_URL: redis://localhost:6379

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          NODE_ENV: test

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  security:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run security audit
        run: npm audit --audit-level=high

      - name: Run Snyk security scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  build:
    needs: [test, security]
    runs-on: ubuntu-latest

    strategy:
      matrix:
        service: [customer-portal, vendor-portal, admin-console, api-gateway, auth-service, catalog-service]

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ github.repository }}/${{ matrix.service }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./apps/${{ matrix.service }}/Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup kubectl
        uses: azure/k8s-set-context@v3
        with:
          method: kubeconfig
          kubeconfig: ${{ secrets.KUBE_CONFIG_STAGING }}

      - name: Deploy to staging
        run: |
          # Update image tags in manifests
          find infrastructure/k8s -name "*.yaml" -exec sed -i "s|:latest|:develop-${{ github.sha }}|g" {} \;
          
          # Apply manifests
          kubectl apply -f infrastructure/k8s/namespace.yaml
          kubectl apply -f infrastructure/k8s/config.yaml
          kubectl apply -f infrastructure/k8s/secrets.yaml
          kubectl apply -f infrastructure/k8s/
          
          # Wait for rollout
          kubectl rollout status deployment/customer-portal -n autopilot-staging --timeout=300s
          kubectl rollout status deployment/api-gateway -n autopilot-staging --timeout=300s

      - name: Run smoke tests
        run: |
          # Wait for services to be ready
          sleep 30
          
          # Run smoke tests
          npm run test:smoke -- --baseUrl=https://staging.autopilot.monster

      - name: Notify team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Staging deployment completed for commit ${{ github.sha }}'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup kubectl
        uses: azure/k8s-set-context@v3
        with:
          method: kubeconfig
          kubeconfig: ${{ secrets.KUBE_CONFIG_PRODUCTION }}

      - name: Deploy to production
        run: |
          # Update image tags in manifests
          find infrastructure/k8s -name "*.yaml" -exec sed -i "s|:latest|:main-${{ github.sha }}|g" {} \;
          
          # Apply manifests with rolling update
          kubectl apply -f infrastructure/k8s/namespace.yaml
          kubectl apply -f infrastructure/k8s/config.yaml
          kubectl apply -f infrastructure/k8s/secrets.yaml
          kubectl apply -f infrastructure/k8s/
          
          # Wait for rollout
          kubectl rollout status deployment/customer-portal -n autopilot-production --timeout=600s
          kubectl rollout status deployment/api-gateway -n autopilot-production --timeout=600s

      - name: Run health checks
        run: |
          # Wait for services to be ready
          sleep 60
          
          # Run health checks
          curl -f https://autopilot.monster/api/health || exit 1
          curl -f https://api.autopilot.monster/health || exit 1

      - name: Notify stakeholders
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment completed for commit ${{ github.sha }}'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_PRODUCTION }}
```

### 2. Database Migration Script

```typescript
// tools/migration/src/migrations/001-initial-setup.ts
import { MongoClient, Db } from 'mongodb';

export class InitialSetupMigration {
  async up(db: Db): Promise<void> {
    console.log('Running initial setup migration...');

    // Create collections
    await this.createUsersCollection(db);
    await this.createProductsCollection(db);
    await this.createPaymentIntentsCollection(db);
    await this.createLicensesCollection(db);

    // Create indexes
    await this.createIndexes(db);

    console.log('Initial setup migration completed');
  }

  async down(db: Db): Promise<void> {
    console.log('Rolling back initial setup migration...');

    // Drop collections in reverse order
    await db.collection('licenses').drop();
    await db.collection('payment_intents').drop();
    await db.collection('products').drop();
    await db.collection('users').drop();

    console.log('Initial setup migration rolled back');
  }

  private async createUsersCollection(db: Db): Promise<void> {
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'passwordHash', 'profile'],
          properties: {
            email: {
              bsonType: 'string',
              pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            },
            passwordHash: {
              bsonType: 'string',
              minLength: 60,
              maxLength: 60,
            },
            profile: {
              bsonType: 'object',
              required: ['firstName', 'lastName'],
              properties: {
                firstName: { bsonType: 'string', maxLength: 50 },
                lastName: { bsonType: 'string', maxLength: 50 },
                avatar: { bsonType: 'string' },
                bio: { bsonType: 'string', maxLength: 500 },
              },
            },
            roles: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['name', 'grantedAt'],
                properties: {
                  name: {
                    bsonType: 'string',
                    enum: ['customer', 'vendor', 'admin'],
                  },
                  permissions: {
                    bsonType: 'array',
                    items: { bsonType: 'string' },
                  },
                  grantedAt: { bsonType: 'date' },
                },
              },
            },
            isEmailVerified: { bsonType: 'bool' },
            lastLoginAt: { bsonType: 'date' },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });
  }

  private async createProductsCollection(db: Db): Promise<void> {
    await db.createCollection('products', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['vendorId', 'title', 'description', 'type', 'pricing'],
          properties: {
            vendorId: { bsonType: 'objectId' },
            title: { bsonType: 'string', maxLength: 200 },
            description: { bsonType: 'string', maxLength: 5000 },
            shortDescription: { bsonType: 'string', maxLength: 300 },
            type: {
              bsonType: 'string',
              enum: ['ai-agent', 'n8n-workflow', 'automation-asset'],
            },
            categories: {
              bsonType: 'array',
              items: { bsonType: 'string' },
            },
            tags: {
              bsonType: 'array',
              items: { bsonType: 'string' },
              maxItems: 20,
            },
            pricing: {
              bsonType: 'object',
              required: ['type', 'currency'],
              properties: {
                type: {
                  bsonType: 'string',
                  enum: ['free', 'one-time', 'subscription'],
                },
                amount: {
                  bsonType: 'number',
                  minimum: 0,
                  maximum: 999999,
                },
                currency: { bsonType: 'string', maxLength: 3 },
                subscriptionInterval: {
                  bsonType: 'string',
                  enum: ['monthly', 'yearly'],
                },
              },
            },
            status: {
              bsonType: 'string',
              enum: ['draft', 'pending', 'approved', 'rejected', 'suspended'],
            },
            createdAt: { bsonType: 'date' },
            updatedAt: { bsonType: 'date' },
          },
        },
      },
    });
  }

  private async createIndexes(db: Db): Promise<void> {
    // Users indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('users').createIndex({ 'roles.name': 1 });
    await db.collection('users').createIndex({ createdAt: -1 });

    // Products indexes
    await db.collection('products').createIndex({ vendorId: 1 });
    await db.collection('products').createIndex({ type: 1 });
    await db.collection('products').createIndex({ status: 1 });
    await db.collection('products').createIndex({ categories: 1 });
    await db.collection('products').createIndex({ tags: 1 });
    await db.collection('products').createIndex({
      title: 'text',
      description: 'text',
      tags: 'text',
    });
    await db.collection('products').createIndex({ 'pricing.type': 1 });
    await db.collection('products').createIndex({ 'pricing.amount': 1 });
    await db.collection('products').createIndex({ 'stats.rating': -1 });
    await db.collection('products').createIndex({ 'stats.downloads': -1 });
    await db.collection('products').createIndex({ createdAt: -1 });

    // Compound indexes for common queries
    await db.collection('products').createIndex({
      status: 1,
      type: 1,
      'stats.rating': -1,
    });
    await db.collection('products').createIndex({
      status: 1,
      categories: 1,
      createdAt: -1,
    });
  }
}
```

This comprehensive code examples document provides ready-to-use, production-ready code snippets that demonstrate best practices for building the Autopilot.monster platform. Each example includes proper error handling, type safety, performance optimization, and follows the established architecture patterns.

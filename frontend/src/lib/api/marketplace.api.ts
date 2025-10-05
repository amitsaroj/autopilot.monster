/**
 * Marketplace API - Product and catalog endpoints
 */

import apiClient from './client';

export interface Product {
  productId: string;
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  tags: string[];
  vendorId: string;
  vendorName: string;
  images: string[];
  thumbnail?: string;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  isFeatured: boolean;
  isPopular: boolean;
}

export interface Category {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  productCount: number;
}

export interface Review {
  reviewId: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface SearchFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  tags?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'popular' | 'newest';
  page?: number;
  limit?: number;
}

export const marketplaceApi = {
  /**
   * Search products with filters
   */
  searchProducts: async (filters: SearchFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });

    return apiClient.get<{
      success: boolean;
      data: {
        products: Product[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          pages: number;
        };
      };
    }>(`/api/marketplace/products?${params.toString()}`);
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async (limit: number = 10) => {
    return apiClient.get<{ success: boolean; data: Product[] }>(
      `/api/marketplace/products/featured?limit=${limit}`
    );
  },

  /**
   * Get popular products
   */
  getPopularProducts: async (limit: number = 10) => {
    return apiClient.get<{ success: boolean; data: Product[] }>(
      `/api/marketplace/products/popular?limit=${limit}`
    );
  },

  /**
   * Get product by ID
   */
  getProduct: async (productId: string) => {
    return apiClient.get<{ success: boolean; data: Product }>(
      `/api/marketplace/products/${productId}`
    );
  },

  /**
   * Get all categories
   */
  getCategories: async () => {
    return apiClient.get<{ success: boolean; data: Category[] }>(
      '/api/marketplace/categories'
    );
  },

  /**
   * Get product reviews
   */
  getProductReviews: async (productId: string, page: number = 1, limit: number = 10) => {
    return apiClient.get<{
      success: boolean;
      data: {
        reviews: Review[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          pages: number;
        };
      };
    }>(`/api/marketplace/products/${productId}/reviews?page=${page}&limit=${limit}`);
  },

  /**
   * Create product review
   */
  createReview: async (
    token: string,
    productId: string,
    data: { rating: number; title?: string; comment: string }
  ) => {
    return apiClient.post<{ success: boolean; data: Review }>(
      `/api/marketplace/products/${productId}/reviews`,
      data,
      { token }
    );
  },

  /**
   * Create product (vendor only)
   */
  createProduct: async (token: string, data: Partial<Product>) => {
    return apiClient.post<{ success: boolean; data: Product }>(
      '/api/marketplace/products',
      data,
      { token }
    );
  },

  /**
   * Update product (vendor only)
   */
  updateProduct: async (token: string, productId: string, data: Partial<Product>) => {
    return apiClient.put<{ success: boolean; data: Product }>(
      `/api/marketplace/products/${productId}`,
      data,
      { token }
    );
  },

  /**
   * Delete product (vendor only)
   */
  deleteProduct: async (token: string, productId: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/api/marketplace/products/${productId}`,
      { token }
    );
  },
};

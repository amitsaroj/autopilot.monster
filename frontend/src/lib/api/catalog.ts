import { apiClient, ApiResponse, PaginatedResponse } from './client';

export interface Product {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  shortDescription: string;
  slug: string;
  type: string;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  pricing: {
    type: string;
    price: number;
    discountPrice?: number;
    discountUntil?: string;
    currency: string;
    tiers?: Array<{
      name: string;
      description: string;
      price: number;
      features: Record<string, string>;
    }>;
  };
  files: Array<{
    id: string;
    name: string;
    description: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    checksum: string;
    downloadCount: number;
    createdAt: string;
  }>;
  screenshots: string[];
  status: string;
  metadata: {
    version: string;
    compatibility: string[];
    requirements: string[];
    documentationUrl?: string;
    demoUrl?: string;
    githubUrl?: string;
    customFields: Record<string, string>;
  };
  stats: {
    totalViews: number;
    totalDownloads: number;
    totalPurchases: number;
    averageRating: number;
    totalReviews: number;
    viewsLast30Days: number;
    downloadsLast30Days: number;
  };
  isFeatured: boolean;
  isPromoted: boolean;
  promotedUntil?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId?: string;
  icon?: string;
  color?: string;
  productsCount: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  shortDescription: string;
  type: string;
  categoryId: string;
  tags: string[];
  pricing: {
    type: string;
    price: number;
    discountPrice?: number;
    discountUntil?: string;
    currency: string;
    tiers?: Array<{
      name: string;
      description: string;
      price: number;
      features: Record<string, string>;
    }>;
  };
  files: Array<{
    name: string;
    description: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    checksum: string;
  }>;
  screenshots: string[];
  metadata: {
    version: string;
    compatibility: string[];
    requirements: string[];
    documentationUrl?: string;
    demoUrl?: string;
    githubUrl?: string;
    customFields: Record<string, string>;
  };
}

export interface SearchProductsRequest {
  query?: string;
  page?: number;
  limit?: number;
  categories?: string[];
  types?: string[];
  priceRange?: {
    minPrice: number;
    maxPrice: number;
  };
  tags?: string[];
  minRating?: number;
}

export interface GetProductsRequest {
  page?: number;
  limit?: number;
  categoryId?: string;
  type?: string;
  status?: string;
  priceRange?: {
    minPrice: number;
    maxPrice: number;
  };
  sortBy?: string;
  sortOrder?: string;
}

export class CatalogAPI {
  // Product management
  static async createProduct(productData: CreateProductRequest): Promise<ApiResponse<{ productId: string }>> {
    return apiClient.post<ApiResponse<{ productId: string }>>('/catalog/products', productData);
  }

  static async getProduct(productId: string): Promise<ApiResponse<Product>> {
    return apiClient.get<ApiResponse<Product>>(`/catalog/products/${productId}`);
  }

  static async updateProduct(productId: string, productData: Partial<CreateProductRequest>): Promise<ApiResponse<Product>> {
    return apiClient.put<ApiResponse<Product>>(`/catalog/products/${productId}`, productData);
  }

  static async deleteProduct(productId: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/catalog/products/${productId}`);
  }

  static async getProducts(params: GetProductsRequest = {}): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiClient.get<PaginatedResponse<Product>>(`/catalog/products?${queryParams.toString()}`);
  }

  // Search
  static async searchProducts(params: SearchProductsRequest = {}): Promise<PaginatedResponse<Product>> {
    return apiClient.post<PaginatedResponse<Product>>('/catalog/search', params);
  }

  static async getFeaturedProducts(limit: number = 10, type?: string): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    if (type) params.append('type', type);
    
    return apiClient.get<ApiResponse<Product[]>>(`/catalog/featured?${params.toString()}`);
  }

  static async getTrendingProducts(limit: number = 10, type?: string, days: number = 7): Promise<ApiResponse<Product[]>> {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('days', days.toString());
    if (type) params.append('type', type);
    
    return apiClient.get<ApiResponse<Product[]>>(`/catalog/trending?${params.toString()}`);
  }

  // Vendor products
  static async getVendorProducts(vendorId: string, params: { page?: number; limit?: number; status?: string } = {}): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiClient.get<PaginatedResponse<Product>>(`/catalog/vendors/${vendorId}/products?${queryParams.toString()}`);
  }

  // Categories
  static async getCategories(): Promise<ApiResponse<Category[]>> {
    return apiClient.get<ApiResponse<Category[]>>('/catalog/categories');
  }

  static async getCategory(categoryId: string): Promise<ApiResponse<Category>> {
    return apiClient.get<ApiResponse<Category>>(`/catalog/categories/${categoryId}`);
  }

  // Analytics
  static async getProductAnalytics(productId: string): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(`/catalog/products/${productId}/analytics`);
  }

  static async trackProductView(productId: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(`/catalog/products/${productId}/track-view`);
  }

  static async trackProductDownload(productId: string, fileId: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(`/catalog/products/${productId}/track-download`, { fileId });
  }

  // File upload
  static async uploadProductFile(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ fileUrl: string; fileId: string }>> {
    return apiClient.uploadFile<ApiResponse<{ fileUrl: string; fileId: string }>>('/catalog/upload', file, onProgress);
  }

  static async uploadScreenshot(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ imageUrl: string }>> {
    return apiClient.uploadFile<ApiResponse<{ imageUrl: string }>>('/catalog/upload-screenshot', file, onProgress);
  }
}

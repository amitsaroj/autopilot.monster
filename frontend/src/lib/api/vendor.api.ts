/**
 * Vendor API - Vendor dashboard and management endpoints
 */

import apiClient from './client';

export interface VendorProfile {
  vendorId: string;
  name: string;
  avatar: string;
  joinDate: string;
  description: string;
  verified: boolean;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
}

export interface VendorProduct {
  id: string;
  name: string;
  type: 'agent' | 'workflow' | 'tool';
  price: number;
  status: 'active' | 'pending' | 'rejected' | 'draft';
  downloads: number;
  revenue: number;
  rating: number;
  reviews: number;
  uploadDate: string;
  image: string;
  description: string;
}

export interface VendorAnalytics {
  totalRevenue: number;
  totalDownloads: number;
  totalProducts: number;
  averageRating: number;
  monthlyRevenue?: number;
  monthlyDownloads?: number;
  revenueGrowth?: number;
  downloadsGrowth?: number;
}

export interface VendorEarnings {
  availableBalance: number;
  pendingClearance: number;
  lifetimeEarnings: number;
  lastPayoutDate?: string;
  nextPayoutDate?: string;
}

export const vendorApi = {
  /**
   * Get vendor profile
   */
  getProfile: async (token?: string) => {
    // For now, return mock data until backend is ready
    return {
      success: true,
      data: {
        vendorId: '1',
        name: 'TechFlow Solutions',
        avatar: '/api/placeholder/100/100',
        joinDate: '2024-01-15',
        description: 'Leading provider of AI automation solutions for enterprise businesses.',
        verified: true
      }
    };
  },

  /**
   * Update vendor profile
   */
  updateProfile: async (token: string, data: Partial<VendorProfile>) => {
    return apiClient.put<{ success: boolean; data: VendorProfile }>(
      '/api/vendors/profile',
      data,
      { token }
    );
  },

  /**
   * Get vendor products
   */
  getProducts: async (token?: string) => {
    // For now, return mock data until backend is ready
    return {
      success: true,
      products: [
        {
          id: '1',
          name: 'AutoLeadGen Pro Agent',
          type: 'agent' as const,
          price: 149.99,
          status: 'active' as const,
          downloads: 2847,
          revenue: 426553.53,
          rating: 4.8,
          reviews: 234,
          uploadDate: '2024-03-15',
          image: '/api/placeholder/300/200',
          description: 'Advanced lead generation AI agent with ML-powered prospect scoring and automated outreach.'
        },
        {
          id: '2',
          name: 'E-commerce Analytics Workflow',
          type: 'workflow' as const,
          price: 79.99,
          status: 'active' as const,
          downloads: 1563,
          revenue: 124984.37,
          rating: 4.6,
          reviews: 89,
          uploadDate: '2024-04-22',
          image: '/api/placeholder/300/200',
          description: 'Comprehensive e-commerce data analysis and reporting workflow for n8n platform.'
        },
        {
          id: '3',
          name: 'Social Media Automation Suite',
          type: 'tool' as const,
          price: 199.99,
          status: 'pending' as const,
          downloads: 0,
          revenue: 0,
          rating: 0,
          reviews: 0,
          uploadDate: '2024-11-30',
          image: '/api/placeholder/300/200',
          description: 'Complete social media management and automation toolkit with AI-powered content generation.'
        },
        {
          id: '4',
          name: 'Customer Support AI Agent',
          type: 'agent' as const,
          price: 299.99,
          status: 'active' as const,
          downloads: 834,
          revenue: 250191.66,
          rating: 4.9,
          reviews: 156,
          uploadDate: '2024-05-10',
          image: '/api/placeholder/300/200',
          description: 'Intelligent customer support agent with natural language processing and automated ticket routing.'
        }
      ]
    };
  },

  /**
   * Get vendor analytics
   */
  getAnalytics: async (token?: string) => {
    // For now, return mock data until backend is ready
    return {
      success: true,
      data: {
        totalRevenue: 801729.56,
        totalDownloads: 5244,
        totalProducts: 4,
        averageRating: 4.7,
        monthlyRevenue: 12847,
        monthlyDownloads: 745,
        revenueGrowth: 23.5,
        downloadsGrowth: 18.7
      }
    };
  },

  /**
   * Get vendor earnings
   */
  getEarnings: async (token: string) => {
    return apiClient.get<{ success: boolean; data: VendorEarnings }>(
      '/api/vendors/earnings',
      { token }
    );
  },

  /**
   * Create product
   */
  createProduct: async (token: string, data: Partial<VendorProduct>) => {
    return apiClient.post<{ success: boolean; data: VendorProduct }>(
      '/api/vendors/products',
      data,
      { token }
    );
  },

  /**
   * Update product
   */
  updateProduct: async (token: string, productId: string, data: Partial<VendorProduct>) => {
    return apiClient.put<{ success: boolean; data: VendorProduct }>(
      `/api/vendors/products/${productId}`,
      data,
      { token }
    );
  },

  /**
   * Delete product
   */
  deleteProduct: async (token: string, productId: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/api/vendors/products/${productId}`,
      { token }
    );
  },

  /**
   * Request payout
   */
  requestPayout: async (token: string, amount: number) => {
    return apiClient.post<{ success: boolean; message: string }>(
      '/api/vendors/payouts',
      { amount },
      { token }
    );
  },
};

export default vendorApi;


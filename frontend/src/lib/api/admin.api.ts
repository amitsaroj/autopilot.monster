/**
 * Admin API - Admin dashboard and management endpoints
 */

import apiClient from './client';

export interface AdminDashboardStats {
  overview: {
    totalUsers: number;
    totalVendors: number;
    totalProducts: number;
    totalRevenue: number;
    monthlyActiveUsers: number;
    revenueGrowth: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'user' | 'vendor' | 'product' | 'transaction';
    action: string;
    description: string;
    timestamp: string;
    status: 'success' | 'pending' | 'failed';
  }>;
  systemHealth: {
    status: 'operational' | 'degraded' | 'down';
    uptime: number;
    responseTime: number;
    errorRate: number;
  };
}

export interface AdminUser {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'vendor' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
  lastLogin?: string;
  totalPurchases: number;
  totalSpent: number;
}

export interface AdminVendor {
  vendorId: string;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'suspended';
  verified: boolean;
  productsCount: number;
  totalRevenue: number;
  rating: number;
  joinDate: string;
}

export interface AdminProduct {
  productId: string;
  name: string;
  vendorId: string;
  vendorName: string;
  status: 'active' | 'pending' | 'rejected' | 'draft';
  price: number;
  downloads: number;
  revenue: number;
  rating: number;
  createdAt: string;
}

export const adminApi = {
  /**
   * Get admin dashboard stats
   */
  getDashboardStats: async (token: string) => {
    return apiClient.get<{ success: boolean; data: AdminDashboardStats }>(
      '/api/admin/dashboard',
      { token }
    );
  },

  /**
   * Get all users
   */
  getUsers: async (token: string, params?: { page?: number; limit?: number; search?: string; status?: string }) => {
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
        users: AdminUser[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          pages: number;
        };
      };
    }>(`/api/admin/users?${queryParams.toString()}`, { token });
  },

  /**
   * Get user by ID
   */
  getUser: async (token: string, userId: string) => {
    return apiClient.get<{ success: boolean; data: AdminUser }>(
      `/api/admin/users/${userId}`,
      { token }
    );
  },

  /**
   * Update user
   */
  updateUser: async (token: string, userId: string, data: Partial<AdminUser>) => {
    return apiClient.put<{ success: boolean; data: AdminUser }>(
      `/api/admin/users/${userId}`,
      data,
      { token }
    );
  },

  /**
   * Delete user
   */
  deleteUser: async (token: string, userId: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/api/admin/users/${userId}`,
      { token }
    );
  },

  /**
   * Get all vendors
   */
  getVendors: async (token: string, params?: { page?: number; limit?: number; search?: string; status?: string }) => {
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
        vendors: AdminVendor[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          pages: number;
        };
      };
    }>(`/api/admin/vendors?${queryParams.toString()}`, { token });
  },

  /**
   * Get vendor by ID
   */
  getVendor: async (token: string, vendorId: string) => {
    return apiClient.get<{ success: boolean; data: AdminVendor }>(
      `/api/admin/vendors/${vendorId}`,
      { token }
    );
  },

  /**
   * Update vendor
   */
  updateVendor: async (token: string, vendorId: string, data: Partial<AdminVendor>) => {
    return apiClient.put<{ success: boolean; data: AdminVendor }>(
      `/api/admin/vendors/${vendorId}`,
      data,
      { token }
    );
  },

  /**
   * Approve vendor
   */
  approveVendor: async (token: string, vendorId: string) => {
    return apiClient.post<{ success: boolean; data: AdminVendor }>(
      `/api/admin/vendors/${vendorId}/approve`,
      {},
      { token }
    );
  },

  /**
   * Reject vendor
   */
  rejectVendor: async (token: string, vendorId: string, reason: string) => {
    return apiClient.post<{ success: boolean; message: string }>(
      `/api/admin/vendors/${vendorId}/reject`,
      { reason },
      { token }
    );
  },

  /**
   * Get all products
   */
  getProducts: async (token: string, params?: { page?: number; limit?: number; search?: string; status?: string }) => {
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
        products: AdminProduct[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          pages: number;
        };
      };
    }>(`/api/admin/products?${queryParams.toString()}`, { token });
  },

  /**
   * Approve product
   */
  approveProduct: async (token: string, productId: string) => {
    return apiClient.post<{ success: boolean; data: AdminProduct }>(
      `/api/admin/products/${productId}/approve`,
      {},
      { token }
    );
  },

  /**
   * Reject product
   */
  rejectProduct: async (token: string, productId: string, reason: string) => {
    return apiClient.post<{ success: boolean; message: string }>(
      `/api/admin/products/${productId}/reject`,
      { reason },
      { token }
    );
  },

  /**
   * Delete product
   */
  deleteProduct: async (token: string, productId: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/api/admin/products/${productId}`,
      { token }
    );
  },
};

export default adminApi;


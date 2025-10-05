/**
 * User API - User profile and preferences endpoints
 */

import apiClient from './client';

export interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
  };
}

export interface Wishlist {
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    productPrice: number;
    addedAt: string;
  }>;
}

export interface Subscription {
  userId: string;
  plan: 'free' | 'basic' | 'pro' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  amount: number;
}

export const userApi = {
  /**
   * Get user profile
   */
  getProfile: async (token: string) => {
    return apiClient.get<{ success: boolean; data: UserProfile }>('/api/users/profile', { token });
  },

  /**
   * Update user profile
   */
  updateProfile: async (token: string, data: Partial<UserProfile>) => {
    return apiClient.put<{ success: boolean; data: UserProfile }>(
      '/api/users/profile',
      data,
      { token }
    );
  },

  /**
   * Get dashboard stats
   */
  getDashboard: async (token: string) => {
    return apiClient.get<{ success: boolean; data: any }>('/api/users/dashboard', { token });
  },

  /**
   * Get wishlist
   */
  getWishlist: async (token: string) => {
    return apiClient.get<{ success: boolean; data: Wishlist }>('/api/users/wishlist', { token });
  },

  /**
   * Add to wishlist
   */
  addToWishlist: async (
    token: string,
    item: {
      productId: string;
      productName: string;
      productPrice: number;
    }
  ) => {
    return apiClient.post<{ success: boolean; data: Wishlist }>(
      '/api/users/wishlist',
      item,
      { token }
    );
  },

  /**
   * Remove from wishlist
   */
  removeFromWishlist: async (token: string, productId: string) => {
    return apiClient.delete<{ success: boolean; data: Wishlist }>(
      `/api/users/wishlist/${productId}`,
      { token }
    );
  },

  /**
   * Get subscriptions
   */
  getSubscriptions: async (token: string) => {
    return apiClient.get<{ success: boolean; data: Subscription[] }>(
      '/api/users/subscriptions',
      { token }
    );
  },

  /**
   * Get active subscription
   */
  getActiveSubscription: async (token: string) => {
    return apiClient.get<{ success: boolean; data: Subscription | null }>(
      '/api/users/subscriptions/active',
      { token }
    );
  },

  /**
   * Cancel subscription
   */
  cancelSubscription: async (token: string, subscriptionId: string) => {
    return apiClient.post<{ success: boolean; data: Subscription }>(
      `/api/users/subscriptions/${subscriptionId}/cancel`,
      {},
      { token }
    );
  },
};

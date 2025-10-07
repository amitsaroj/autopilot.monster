/**
 * Cart API - Shopping cart endpoints
 */

import apiClient from './client';

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  thumbnail?: string;
  vendorId: string;
  subtotal: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  tax: number;
  total: number;
}

export const cartApi = {
  /**
   * Get user cart
   */
  getCart: async (token: string) => {
    return apiClient.get<{ success: boolean; data: Cart }>('/api/cart', { token });
  },

  /**
   * Add item to cart
   */
  addItem: async (
    token: string,
    item: {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      thumbnail?: string;
      vendorId: string;
    }
  ) => {
    return apiClient.post<{ success: boolean; data: Cart }>('/api/cart/items', item, { token });
  },

  /**
   * Update cart item quantity
   */
  updateItem: async (token: string, productId: string, quantity: number) => {
    return apiClient.put<{ success: boolean; data: Cart }>(
      `/api/cart/items/${productId}`,
      { quantity },
      { token }
    );
  },

  /**
   * Remove item from cart
   */
  removeItem: async (token: string, productId: string) => {
    return apiClient.delete<{ success: boolean; data: Cart }>(
      `/api/cart/items/${productId}`,
      { token }
    );
  },

  /**
   * Clear cart
   */
  clearCart: async (token: string) => {
    return apiClient.delete<{ success: boolean; message: string }>('/api/cart', { token });
  },

  /**
   * Apply coupon code
   */
  applyCoupon: async (token: string, couponCode: string) => {
    return apiClient.post<{ success: boolean; data: Cart }>(
      '/api/cart/coupon',
      { couponCode },
      { token }
    );
  },

  /**
   * Remove coupon
   */
  removeCoupon: async (token: string) => {
    return apiClient.delete<{ success: boolean; data: Cart }>('/api/cart/coupon', { token });
  },
};

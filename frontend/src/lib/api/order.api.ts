/**
 * Order API - Order and payment endpoints
 */

import apiClient from './client';

export interface Order {
  orderId: string;
  userId: string;
  userEmail: string;
  items: any[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
}

export interface Payment {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
}

export const orderApi = {
  /**
   * Create order
   */
  createOrder: async (
    token: string,
    data: {
      items: any[];
      subtotal: number;
      discount: number;
      tax: number;
      total: number;
      paymentMethod: string;
      shippingAddress?: any;
      billingAddress?: any;
    }
  ) => {
    return apiClient.post<{ success: boolean; data: Order }>('/api/orders', data, { token });
  },

  /**
   * Get user orders
   */
  getUserOrders: async (token: string, page: number = 1, limit: number = 20) => {
    return apiClient.get<{
      success: boolean;
      data: {
        orders: Order[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          pages: number;
        };
      };
    }>(`/api/orders?page=${page}&limit=${limit}`, { token });
  },

  /**
   * Get order by ID
   */
  getOrder: async (token: string, orderId: string) => {
    return apiClient.get<{ success: boolean; data: Order }>(`/api/orders/${orderId}`, { token });
  },

  /**
   * Cancel order
   */
  cancelOrder: async (token: string, orderId: string) => {
    return apiClient.post<{ success: boolean; data: Order }>(
      `/api/orders/${orderId}/cancel`,
      {},
      { token }
    );
  },

  /**
   * Process payment
   */
  processPayment: async (
    token: string,
    orderId: string,
    data: {
      amount: number;
      method: 'card' | 'paypal' | 'stripe' | 'bank_transfer' | 'wallet';
    }
  ) => {
    return apiClient.post<{ success: boolean; data: Payment }>(
      `/api/orders/${orderId}/payment`,
      data,
      { token }
    );
  },

  /**
   * Get payment status
   */
  getPaymentStatus: async (orderId: string) => {
    return apiClient.get<{ success: boolean; data: Payment }>(`/api/orders/${orderId}/payment`);
  },

  /**
   * Get order statistics
   */
  getOrderStats: async (token: string) => {
    return apiClient.get<{ success: boolean; data: any }>('/api/stats', { token });
  },
};

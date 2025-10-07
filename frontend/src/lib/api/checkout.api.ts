/**
 * Checkout API - Checkout and payment processing endpoints
 */

import apiClient from './client';

export interface CheckoutSession {
  sessionId: string;
  cartId: string;
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  expiresAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'stripe';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
}

export const checkoutApi = {
  /**
   * Create checkout session
   */
  createSession: async (token: string, cartId: string) => {
    return apiClient.post<{ success: boolean; data: CheckoutSession }>(
      '/api/checkout/session',
      { cartId },
      { token }
    );
  },

  /**
   * Get checkout session
   */
  getSession: async (token: string, sessionId: string) => {
    return apiClient.get<{ success: boolean; data: CheckoutSession }>(
      `/api/checkout/session/${sessionId}`,
      { token }
    );
  },

  /**
   * Process payment
   */
  processPayment: async (
    token: string,
    sessionId: string,
    paymentData: {
      paymentMethodId: string;
      billingAddress?: ShippingAddress;
      savePaymentMethod?: boolean;
    }
  ) => {
    return apiClient.post<{
      success: boolean;
      data: {
        orderId: string;
        status: 'success' | 'failed';
        message: string;
      };
    }>(
      `/api/checkout/session/${sessionId}/payment`,
      paymentData,
      { token }
    );
  },

  /**
   * Get payment methods
   */
  getPaymentMethods: async (token: string) => {
    return apiClient.get<{ success: boolean; data: PaymentMethod[] }>(
      '/api/checkout/payment-methods',
      { token }
    );
  },

  /**
   * Add payment method
   */
  addPaymentMethod: async (
    token: string,
    paymentMethod: Omit<PaymentMethod, 'id'>
  ) => {
    return apiClient.post<{ success: boolean; data: PaymentMethod }>(
      '/api/checkout/payment-methods',
      paymentMethod,
      { token }
    );
  },

  /**
   * Delete payment method
   */
  deletePaymentMethod: async (token: string, paymentMethodId: string) => {
    return apiClient.delete<{ success: boolean; message: string }>(
      `/api/checkout/payment-methods/${paymentMethodId}`,
      { token }
    );
  },

  /**
   * Set default payment method
   */
  setDefaultPaymentMethod: async (token: string, paymentMethodId: string) => {
    return apiClient.post<{ success: boolean; data: PaymentMethod }>(
      `/api/checkout/payment-methods/${paymentMethodId}/set-default`,
      {},
      { token }
    );
  },

  /**
   * Apply coupon
   */
  applyCoupon: async (token: string, sessionId: string, couponCode: string) => {
    return apiClient.post<{
      success: boolean;
      data: {
        discount: number;
        newTotal: number;
      };
    }>(
      `/api/checkout/session/${sessionId}/coupon`,
      { couponCode },
      { token }
    );
  },
};

export default checkoutApi;


import { apiClient, ApiResponse, PaginatedResponse } from './client';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  vendorId: string;
  vendorName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  pricingTier: string;
  currency: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  appliedCoupon?: {
    code: string;
    name: string;
    type: string;
    value: number;
    discountAmount: number;
  };
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    vendorId: string;
    vendorName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    pricingTier: string;
    licenseKey?: string;
    downloadUrls: string[];
    purchasedAt: string;
  }>;
  status: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  billingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  payment: {
    id: string;
    provider: string;
    providerPaymentId: string;
    paymentMethod: string;
    amount: number;
    currency: string;
    status: string;
    failureReason?: string;
    createdAt: string;
    updatedAt: string;
  };
  appliedCoupon?: {
    code: string;
    name: string;
    type: string;
    value: number;
    discountAmount: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
  provider: string;
  providerData: Record<string, any>;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  status: string;
  amount: number;
  currency: string;
  billingCycle: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Refund {
  id: string;
  orderId: string;
  paymentId: string;
  amount: number;
  currency: string;
  reason: string;
  status: string;
  providerRefundId?: string;
  adminId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export class PaymentAPI {
  // Cart management
  static async getCart(): Promise<ApiResponse<Cart>> {
    return apiClient.get<ApiResponse<Cart>>('/payment/cart');
  }

  static async addToCart(productId: string, quantity: number = 1, pricingTier?: string): Promise<ApiResponse<Cart>> {
    return apiClient.post<ApiResponse<Cart>>('/payment/cart/items', {
      productId,
      quantity,
      pricingTier,
    });
  }

  static async updateCartItem(itemId: string, quantity: number, pricingTier?: string): Promise<ApiResponse<Cart>> {
    return apiClient.put<ApiResponse<Cart>>(`/payment/cart/items/${itemId}`, {
      quantity,
      pricingTier,
    });
  }

  static async removeFromCart(itemId: string): Promise<ApiResponse<Cart>> {
    return apiClient.delete<ApiResponse<Cart>>(`/payment/cart/items/${itemId}`);
  }

  static async clearCart(): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>('/payment/cart');
  }

  static async applyCoupon(couponCode: string): Promise<ApiResponse<Cart>> {
    return apiClient.post<ApiResponse<Cart>>('/payment/cart/coupon', { couponCode });
  }

  // Orders
  static async createOrder(orderData: {
    billingAddress: any;
    paymentMethod: any;
    couponCode?: string;
  }): Promise<ApiResponse<{ orderId: string; order: Order }>> {
    return apiClient.post<ApiResponse<{ orderId: string; order: Order }>>('/payment/orders', orderData);
  }

  static async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return apiClient.get<ApiResponse<Order>>(`/payment/orders/${orderId}`);
  }

  static async getOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<PaginatedResponse<Order>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiClient.get<PaginatedResponse<Order>>(`/payment/orders?${queryParams.toString()}`);
  }

  static async cancelOrder(orderId: string, reason?: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(`/payment/orders/${orderId}/cancel`, { reason });
  }

  // Payment processing
  static async createPaymentIntent(orderId: string, provider: string = 'stripe'): Promise<ApiResponse<PaymentIntent>> {
    return apiClient.post<ApiResponse<PaymentIntent>>('/payment/payment-intent', {
      orderId,
      provider,
    });
  }

  static async confirmPayment(paymentIntentId: string, paymentMethodId: string, provider: string = 'stripe'): Promise<ApiResponse<{ status: string; payment: any }>> {
    return apiClient.post<ApiResponse<{ status: string; payment: any }>>('/payment/confirm', {
      paymentIntentId,
      paymentMethodId,
      provider,
    });
  }

  // Subscriptions
  static async createSubscription(subscriptionData: {
    planId: string;
    paymentMethod: any;
    couponCode?: string;
  }): Promise<ApiResponse<{ subscriptionId: string; subscription: Subscription }>> {
    return apiClient.post<ApiResponse<{ subscriptionId: string; subscription: Subscription }>>('/payment/subscriptions', subscriptionData);
  }

  static async getSubscription(subscriptionId: string): Promise<ApiResponse<Subscription>> {
    return apiClient.get<ApiResponse<Subscription>>(`/payment/subscriptions/${subscriptionId}`);
  }

  static async getSubscriptions(): Promise<ApiResponse<Subscription[]>> {
    return apiClient.get<ApiResponse<Subscription[]>>('/payment/subscriptions');
  }

  static async updateSubscription(subscriptionId: string, newPlanId: string, prorate: boolean = true): Promise<ApiResponse<Subscription>> {
    return apiClient.put<ApiResponse<Subscription>>(`/payment/subscriptions/${subscriptionId}`, {
      newPlanId,
      prorate,
    });
  }

  static async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true, reason?: string): Promise<ApiResponse<Subscription>> {
    return apiClient.post<ApiResponse<Subscription>>(`/payment/subscriptions/${subscriptionId}/cancel`, {
      cancelAtPeriodEnd,
      reason,
    });
  }

  // Refunds
  static async createRefund(orderId: string, amount: number, reason: string): Promise<ApiResponse<{ refundId: string; refund: Refund }>> {
    return apiClient.post<ApiResponse<{ refundId: string; refund: Refund }>>('/payment/refunds', {
      orderId,
      amount,
      reason,
    });
  }

  static async getRefunds(params: {
    orderId?: string;
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<PaginatedResponse<Refund>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiClient.get<PaginatedResponse<Refund>>(`/payment/refunds?${queryParams.toString()}`);
  }

  // Analytics
  static async getPaymentAnalytics(params: {
    startDate?: string;
    endDate?: string;
    currency?: string;
  } = {}): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiClient.get<ApiResponse<any>>(`/payment/analytics?${queryParams.toString()}`);
  }

  // Vendor payouts
  static async getVendorPayouts(params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiClient.get<PaginatedResponse<any>>(`/payment/payouts?${queryParams.toString()}`);
  }
}

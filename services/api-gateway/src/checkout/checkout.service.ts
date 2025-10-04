import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);
  private readonly paymentServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.paymentServiceUrl = this.configService.get<string>('PAYMENT_SERVICE_URL', 'http://localhost:3004');
  }

  async initiateCheckout(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...checkoutData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/checkout/initiate`, checkoutData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error initiating checkout:', error.message);
      throw error;
    }
  }

  async getCheckoutSession(data: { sessionId: string; userId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.paymentServiceUrl}/api/v1/checkout/session/${data.sessionId}`, {
          headers: { 'X-User-ID': data.userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting checkout session:', error.message);
      throw error;
    }
  }

  async createPaymentIntent(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...paymentData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/checkout/payment-intent`, paymentData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error creating payment intent:', error.message);
      throw error;
    }
  }

  async confirmPayment(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...paymentData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/checkout/payment/confirm`, paymentData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error confirming payment:', error.message);
      throw error;
    }
  }

  async cancelPayment(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...paymentData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/checkout/payment/cancel`, paymentData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error cancelling payment:', error.message);
      throw error;
    }
  }

  async getShippingOptions(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...query } = data;
      const response = await firstValueFrom(
        this.httpService.get(`${this.paymentServiceUrl}/api/v1/checkout/shipping/options`, {
          params: query,
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting shipping options:', error.message);
      throw error;
    }
  }

  async calculateShipping(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...shippingData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/checkout/shipping/calculate`, shippingData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error calculating shipping:', error.message);
      throw error;
    }
  }

  async calculateTax(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...taxData } = data;
      const response = await firstValueFrom(
        this.httpService.get(`${this.paymentServiceUrl}/api/v1/checkout/tax/calculate`, {
          params: taxData,
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error calculating tax:', error.message);
      throw error;
    }
  }

  async getPaymentMethods(data: { userId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.paymentServiceUrl}/api/v1/checkout/payment-methods`, {
          headers: { 'X-User-ID': data.userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting payment methods:', error.message);
      throw error;
    }
  }

  async addPaymentMethod(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...paymentMethodData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/checkout/payment-methods`, paymentMethodData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error adding payment method:', error.message);
      throw error;
    }
  }

  async getAddresses(data: { userId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.paymentServiceUrl}/api/v1/checkout/addresses`, {
          headers: { 'X-User-ID': data.userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting addresses:', error.message);
      throw error;
    }
  }

  async addAddress(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...addressData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/checkout/addresses`, addressData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error adding address:', error.message);
      throw error;
    }
  }

  async updateAddress(data: { addressId: string; userId: string; [key: string]: any }) {
    try {
      const { addressId, userId, ...addressData } = data;
      const response = await firstValueFrom(
        this.httpService.put(`${this.paymentServiceUrl}/api/v1/checkout/addresses/${addressId}`, addressData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error updating address:', error.message);
      throw error;
    }
  }

  async validateCheckout(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...checkoutData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/checkout/validate`, checkoutData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error validating checkout:', error.message);
      throw error;
    }
  }

  async completeCheckout(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...checkoutData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/checkout/complete`, checkoutData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error completing checkout:', error.message);
      throw error;
    }
  }

  async getOrder(data: { orderId: string; userId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.paymentServiceUrl}/api/v1/checkout/orders/${data.orderId}`, {
          headers: { 'X-User-ID': data.userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting order:', error.message);
      throw error;
    }
  }

  async cancelOrder(data: { orderId: string; userId: string; [key: string]: any }) {
    try {
      const { orderId, userId, ...cancelData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/checkout/orders/${orderId}/cancel`, cancelData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error cancelling order:', error.message);
      throw error;
    }
  }

  async requestRefund(data: { orderId: string; userId: string; [key: string]: any }) {
    try {
      const { orderId, userId, ...refundData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/checkout/orders/${orderId}/refund`, refundData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error requesting refund:', error.message);
      throw error;
    }
  }

  async handlePaymentSuccess(data: { sessionId: string; userId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.paymentServiceUrl}/api/v1/checkout/success/${data.sessionId}`, {
          headers: { 'X-User-ID': data.userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error handling payment success:', error.message);
      throw error;
    }
  }

  async handlePaymentFailure(data: { sessionId: string; userId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.paymentServiceUrl}/api/v1/checkout/failure/${data.sessionId}`, {
          headers: { 'X-User-ID': data.userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error handling payment failure:', error.message);
      throw error;
    }
  }
}

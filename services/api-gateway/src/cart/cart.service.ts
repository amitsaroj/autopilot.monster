import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);
  private readonly paymentServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.paymentServiceUrl = this.configService.get<string>('PAYMENT_SERVICE_URL', 'http://localhost:3004');
  }

  async getCart(data: { userId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.paymentServiceUrl}/api/v1/cart`, {
          headers: { 'X-User-ID': data.userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting cart:', error.message);
      throw error;
    }
  }

  async addToCart(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...cartData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/cart/items`, cartData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error adding to cart:', error.message);
      throw error;
    }
  }

  async updateCartItem(data: { itemId: string; userId: string; [key: string]: any }) {
    try {
      const { itemId, userId, ...updateData } = data;
      const response = await firstValueFrom(
        this.httpService.put(`${this.paymentServiceUrl}/api/v1/cart/items/${itemId}`, updateData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error updating cart item:', error.message);
      throw error;
    }
  }

  async removeFromCart(data: { itemId: string; userId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.paymentServiceUrl}/api/v1/cart/items/${data.itemId}`, {
          headers: { 'X-User-ID': data.userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error removing from cart:', error.message);
      throw error;
    }
  }

  async clearCart(data: { userId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.paymentServiceUrl}/api/v1/cart`, {
          headers: { 'X-User-ID': data.userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error clearing cart:', error.message);
      throw error;
    }
  }

  async applyCoupon(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...couponData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/cart/coupon`, couponData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error applying coupon:', error.message);
      throw error;
    }
  }

  async removeCoupon(data: { userId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.paymentServiceUrl}/api/v1/cart/coupon`, {
          headers: { 'X-User-ID': data.userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error removing coupon:', error.message);
      throw error;
    }
  }

  async getCartSummary(data: { userId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.paymentServiceUrl}/api/v1/cart/summary`, {
          headers: { 'X-User-ID': data.userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting cart summary:', error.message);
      throw error;
    }
  }

  async validateCart(data: { userId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/cart/validate`, {}, {
          headers: { 'X-User-ID': data.userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error validating cart:', error.message);
      throw error;
    }
  }

  async mergeCart(data: { userId: string; [key: string]: any }) {
    try {
      const { userId, ...mergeData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.paymentServiceUrl}/api/v1/cart/merge`, mergeData, {
          headers: { 'X-User-ID': userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error merging cart:', error.message);
      throw error;
    }
  }

  async getCartCount(data: { userId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.paymentServiceUrl}/api/v1/cart/count`, {
          headers: { 'X-User-ID': data.userId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting cart count:', error.message);
      throw error;
    }
  }
}

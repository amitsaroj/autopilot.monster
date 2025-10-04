import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VendorService {
  private readonly logger = new Logger(VendorService.name);
  private readonly vendorServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.vendorServiceUrl = this.configService.get<string>('VENDOR_SERVICE_URL', 'http://localhost:3006');
  }

  async getProfile(data: { vendorId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.vendorServiceUrl}/api/v1/vendors/profile`, {
          headers: { 'X-User-ID': data.vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting vendor profile:', error.message);
      throw error;
    }
  }

  async updateProfile(data: { vendorId: string; [key: string]: any }) {
    try {
      const { vendorId, ...profileData } = data;
      const response = await firstValueFrom(
        this.httpService.put(`${this.vendorServiceUrl}/api/v1/vendors/profile`, profileData, {
          headers: { 'X-User-ID': vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error updating vendor profile:', error.message);
      throw error;
    }
  }

  async getProducts(data: { vendorId: string; [key: string]: any }) {
    try {
      const { vendorId, ...query } = data;
      const response = await firstValueFrom(
        this.httpService.get(`${this.vendorServiceUrl}/api/v1/vendors/products`, {
          params: query,
          headers: { 'X-User-ID': vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting vendor products:', error.message);
      throw error;
    }
  }

  async createProduct(data: { vendorId: string; [key: string]: any }) {
    try {
      const { vendorId, ...productData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.vendorServiceUrl}/api/v1/vendors/products`, productData, {
          headers: { 'X-User-ID': vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error creating product:', error.message);
      throw error;
    }
  }

  async updateProduct(data: { productId: string; vendorId: string; [key: string]: any }) {
    try {
      const { productId, vendorId, ...productData } = data;
      const response = await firstValueFrom(
        this.httpService.put(`${this.vendorServiceUrl}/api/v1/vendors/products/${productId}`, productData, {
          headers: { 'X-User-ID': vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error updating product:', error.message);
      throw error;
    }
  }

  async deleteProduct(data: { productId: string; vendorId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.vendorServiceUrl}/api/v1/vendors/products/${data.productId}`, {
          headers: { 'X-User-ID': data.vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error deleting product:', error.message);
      throw error;
    }
  }

  async getOrders(data: { vendorId: string; [key: string]: any }) {
    try {
      const { vendorId, ...query } = data;
      const response = await firstValueFrom(
        this.httpService.get(`${this.vendorServiceUrl}/api/v1/vendors/orders`, {
          params: query,
          headers: { 'X-User-ID': vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting vendor orders:', error.message);
      throw error;
    }
  }

  async getOrder(data: { orderId: string; vendorId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.vendorServiceUrl}/api/v1/vendors/orders/${data.orderId}`, {
          headers: { 'X-User-ID': data.vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting vendor order:', error.message);
      throw error;
    }
  }

  async updateOrderStatus(data: { orderId: string; vendorId: string; [key: string]: any }) {
    try {
      const { orderId, vendorId, ...statusData } = data;
      const response = await firstValueFrom(
        this.httpService.put(`${this.vendorServiceUrl}/api/v1/vendors/orders/${orderId}/status`, statusData, {
          headers: { 'X-User-ID': vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error updating order status:', error.message);
      throw error;
    }
  }

  async getAnalytics(data: { vendorId: string; [key: string]: any }) {
    try {
      const { vendorId, ...query } = data;
      const response = await firstValueFrom(
        this.httpService.get(`${this.vendorServiceUrl}/api/v1/vendors/analytics`, {
          params: query,
          headers: { 'X-User-ID': vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting vendor analytics:', error.message);
      throw error;
    }
  }

  async getPayouts(data: { vendorId: string; [key: string]: any }) {
    try {
      const { vendorId, ...query } = data;
      const response = await firstValueFrom(
        this.httpService.get(`${this.vendorServiceUrl}/api/v1/vendors/payouts`, {
          params: query,
          headers: { 'X-User-ID': vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting vendor payouts:', error.message);
      throw error;
    }
  }

  async requestPayout(data: { vendorId: string; [key: string]: any }) {
    try {
      const { vendorId, ...payoutData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.vendorServiceUrl}/api/v1/vendors/payouts/request`, payoutData, {
          headers: { 'X-User-ID': vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error requesting payout:', error.message);
      throw error;
    }
  }

  async getSettings(data: { vendorId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.vendorServiceUrl}/api/v1/vendors/settings`, {
          headers: { 'X-User-ID': data.vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting vendor settings:', error.message);
      throw error;
    }
  }

  async updateSettings(data: { vendorId: string; [key: string]: any }) {
    try {
      const { vendorId, ...settingsData } = data;
      const response = await firstValueFrom(
        this.httpService.put(`${this.vendorServiceUrl}/api/v1/vendors/settings`, settingsData, {
          headers: { 'X-User-ID': vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error updating vendor settings:', error.message);
      throw error;
    }
  }

  async submitKyc(data: { vendorId: string; [key: string]: any }) {
    try {
      const { vendorId, ...kycData } = data;
      const response = await firstValueFrom(
        this.httpService.post(`${this.vendorServiceUrl}/api/v1/vendors/kyc/submit`, kycData, {
          headers: { 'X-User-ID': vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error submitting KYC:', error.message);
      throw error;
    }
  }

  async getKycStatus(data: { vendorId: string }) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.vendorServiceUrl}/api/v1/vendors/kyc/status`, {
          headers: { 'X-User-ID': data.vendorId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error('Error getting KYC status:', error.message);
      throw error;
    }
  }
}

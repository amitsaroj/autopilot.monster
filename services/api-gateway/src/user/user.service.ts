import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly userServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.userServiceUrl = this.configService.get<string>('services.userServiceUrl', 'http://localhost:3001');
  }

  async getProfile(userId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/api/v1/users/${userId}/profile`)
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get user profile', error);
      throw error;
    }
  }

  async updateProfile(userId: string, profileData: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.userServiceUrl}/api/v1/users/${userId}/profile`, profileData)
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to update user profile', error);
      throw error;
    }
  }

  async getOrders(userId: string, query?: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/api/v1/users/${userId}/orders`, { params: query })
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get user orders', error);
      throw error;
    }
  }

  async getWishlist(userId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/api/v1/users/${userId}/wishlist`)
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get user wishlist', error);
      throw error;
    }
  }

  async addToWishlist(userId: string, productId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.userServiceUrl}/api/v1/users/${userId}/wishlist`, { productId })
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to add to wishlist', error);
      throw error;
    }
  }

  async removeFromWishlist(userId: string, productId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.userServiceUrl}/api/v1/users/${userId}/wishlist/${productId}`)
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to remove from wishlist', error);
      throw error;
    }
  }

  async getAnalytics(userId: string, query?: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.userServiceUrl}/api/v1/users/${userId}/analytics`, { params: query })
      );
      return response.data;
    } catch (error) {
      this.logger.error('Failed to get user analytics', error);
      throw error;
    }
  }
}

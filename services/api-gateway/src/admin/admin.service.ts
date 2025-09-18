import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getDashboard() {
    try {
      // For now, return mock data since admin service might not be running
      return {
        success: true,
        data: {
          overview: {
            totalUsers: 1250,
            totalVendors: 45,
            totalProducts: 320,
            totalOrders: 890,
            totalRevenue: 125000,
            currentMonthRevenue: 15000,
          },
          status: {
            activeUsers: 1100,
            pendingVendors: 5,
            lowStockProducts: 12,
          },
          recentOrders: [],
        },
        message: 'Dashboard data retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to get dashboard data:', error);
      throw error;
    }
  }

  async getUsers(query: any) {
    try {
      // Return mock data for now
      return {
        success: true,
        data: {
          users: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 0 }
        },
        message: 'Users retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to get users:', error);
      throw error;
    }
  }

  async getVendors(query: any) {
    try {
      // Return mock data for now
      return {
        success: true,
        data: {
          vendors: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 0 }
        },
        message: 'Vendors retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to get vendors:', error);
      throw error;
    }
  }

  async getProducts(query: any) {
    try {
      // Return mock data for now
      return {
        success: true,
        data: {
          products: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 0 }
        },
        message: 'Products retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to get products:', error);
      throw error;
    }
  }

  async getOrders(query: any) {
    try {
      // Return mock data for now
      return {
        success: true,
        data: {
          orders: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 0 }
        },
        message: 'Orders retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to get orders:', error);
      throw error;
    }
  }

  async getAnalytics() {
    try {
      // Return mock data for now
      return {
        success: true,
        data: {
          revenue: { total: 125000, monthly: 15000 },
          users: { total: 1250, active: 1100 },
          products: { total: 320, lowStock: 12 }
        },
        message: 'Analytics retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to get analytics:', error);
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  async getUserAnalytics(userId: string): Promise<any> {
    // Mock analytics data - in real implementation, this would query various services
    return {
      userId,
      totalOrders: 15,
      totalSpent: 1250.50,
      averageOrderValue: 83.37,
      favoriteCategories: ['AI Tools', 'Automation', 'Productivity'],
      lastOrderDate: new Date('2024-01-15'),
      joinDate: new Date('2023-06-01'),
      activityScore: 85,
      monthlyTrend: [
        { month: 'Jan', orders: 3, spent: 250.00 },
        { month: 'Feb', orders: 2, spent: 180.00 },
        { month: 'Mar', orders: 4, spent: 320.00 },
      ],
    };
  }

  async getSystemAnalytics(): Promise<any> {
    // Mock system analytics
    return {
      totalUsers: 15420,
      activeUsers: 12850,
      newUsersThisMonth: 1250,
      totalRevenue: 1250000.00,
      averageOrderValue: 85.50,
      topProducts: [
        { id: '1', name: 'AI Content Generator', sales: 1250 },
        { id: '2', name: 'Automation Workflow', sales: 980 },
        { id: '3', name: 'Data Analytics Tool', sales: 750 },
      ],
      userGrowth: [
        { month: 'Jan', users: 12000 },
        { month: 'Feb', users: 13500 },
        { month: 'Mar', users: 15420 },
      ],
    };
  }
}

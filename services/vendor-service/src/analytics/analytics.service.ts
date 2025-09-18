import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  async getVendorAnalytics(vendorId: string): Promise<any> {
    // Mock vendor analytics
    return {
      vendorId,
      totalProducts: 25,
      totalSales: 1250,
      totalRevenue: 25000.00,
      averageRating: 4.5,
      monthlyRevenue: [
        { month: 'Jan', revenue: 5000.00 },
        { month: 'Feb', revenue: 7500.00 },
        { month: 'Mar', revenue: 12000.00 },
      ],
      topProducts: [
        { id: '1', name: 'AI Content Generator', sales: 125, revenue: 2500.00 },
        { id: '2', name: 'Automation Workflow', sales: 98, revenue: 1960.00 },
      ],
    };
  }
}

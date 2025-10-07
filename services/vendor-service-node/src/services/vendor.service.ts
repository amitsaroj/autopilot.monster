/**
 * Vendor Service - Business Logic
 */

import { Vendor, IVendor } from '../models/vendor.model';
import { Payout, IPayout } from '../models/payout.model';
import { publishMessage, KafkaTopic } from '../../../../shared/config/kafka';
import { cache } from '../../../../shared/config/redis';
import { logger } from '../../../../shared/config/logger';
import { v4 as uuidv4 } from 'uuid';

export class VendorService {
  /**
   * Register vendor
   */
  async registerVendor(userId: string, vendorData: Partial<IVendor>): Promise<IVendor> {
    try {
      const vendorId = `vendor_${uuidv4()}`;

      const vendor = await Vendor.create({
        vendorId,
        userId,
        ...vendorData,
        status: 'pending',
        verificationStatus: 'unverified',
      });

      // Publish event
      await publishMessage(KafkaTopic.VENDOR_REGISTERED, {
        vendorId,
        userId,
        businessName: vendor.businessName,
        timestamp: new Date().toISOString(),
      });

      return vendor;
    } catch (error) {
      logger.error('Error registering vendor:', error);
      throw new Error('Failed to register vendor');
    }
  }

  /**
   * Get vendor by user ID
   */
  async getVendorByUserId(userId: string): Promise<IVendor | null> {
    try {
      const vendor = await Vendor.findOne({ userId });
      return vendor;
    } catch (error) {
      logger.error('Error getting vendor:', error);
      throw new Error('Failed to get vendor');
    }
  }

  /**
   * Get vendor by ID
   */
  async getVendorById(vendorId: string): Promise<IVendor | null> {
    try {
      const vendor = await Vendor.findOne({ vendorId });
      return vendor;
    } catch (error) {
      logger.error('Error getting vendor:', error);
      throw new Error('Failed to get vendor');
    }
  }

  /**
   * Update vendor
   */
  async updateVendor(vendorId: string, updates: Partial<IVendor>): Promise<IVendor | null> {
    try {
      const vendor = await Vendor.findOneAndUpdate(
        { vendorId },
        { $set: updates },
        { new: true }
      );

      if (vendor) {
        await cache.del(`vendor:${vendorId}`);

        await publishMessage(KafkaTopic.VENDOR_UPDATED, {
          vendorId,
          updates,
          timestamp: new Date().toISOString(),
        });
      }

      return vendor;
    } catch (error) {
      logger.error('Error updating vendor:', error);
      throw new Error('Failed to update vendor');
    }
  }

  /**
   * Get vendor dashboard stats
   */
  async getDashboardStats(vendorId: string): Promise<any> {
    try {
      const vendor = await Vendor.findOne({ vendorId });
      if (!vendor) {
        throw new Error('Vendor not found');
      }

      return {
        totalSales: vendor.totalSales,
        totalRevenue: vendor.totalRevenue,
        productCount: vendor.productCount,
        rating: vendor.rating,
        reviewCount: vendor.reviewCount,
        status: vendor.status,
        verificationStatus: vendor.verificationStatus,
      };
    } catch (error) {
      logger.error('Error getting dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get vendor analytics
   */
  async getAnalytics(vendorId: string, period: string = '30d'): Promise<any> {
    try {
      // Mock analytics data - in real app, aggregate from orders
      return {
        period,
        revenue: {
          current: 15000,
          previous: 12000,
          growth: 25,
        },
        sales: {
          current: 150,
          previous: 120,
          growth: 25,
        },
        topProducts: [],
        recentOrders: [],
      };
    } catch (error) {
      logger.error('Error getting analytics:', error);
      throw new Error('Failed to get analytics');
    }
  }

  /**
   * Request payout
   */
  async requestPayout(vendorId: string, amount: number, method: string): Promise<IPayout> {
    try {
      const vendor = await Vendor.findOne({ vendorId });
      if (!vendor) {
        throw new Error('Vendor not found');
      }

      if (vendor.status !== 'active') {
        throw new Error('Vendor must be active to request payout');
      }

      const payoutId = `payout_${uuidv4()}`;

      const payout = await Payout.create({
        payoutId,
        vendorId,
        amount,
        method,
        status: 'pending',
        currency: 'USD',
      });

      // Publish event
      await publishMessage(KafkaTopic.PAYOUT_REQUESTED, {
        payoutId,
        vendorId,
        amount,
        timestamp: new Date().toISOString(),
      });

      return payout;
    } catch (error) {
      logger.error('Error requesting payout:', error);
      throw error;
    }
  }

  /**
   * Get vendor payouts
   */
  async getPayouts(vendorId: string, page = 1, limit = 20): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const [payouts, total] = await Promise.all([
        Payout.find({ vendorId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Payout.countDocuments({ vendorId }),
      ]);

      return {
        payouts,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting payouts:', error);
      throw new Error('Failed to get payouts');
    }
  }

  /**
   * Get all vendors (admin)
   */
  async getAllVendors(filters: any = {}, page = 1, limit = 20): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const query: any = {};

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.verificationStatus) {
        query.verificationStatus = filters.verificationStatus;
      }

      const [vendors, total] = await Promise.all([
        Vendor.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Vendor.countDocuments(query),
      ]);

      return {
        vendors,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting vendors:', error);
      throw new Error('Failed to get vendors');
    }
  }
}

export const vendorService = new VendorService();

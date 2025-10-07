/**
 * Admin Service - Business Logic
 */

import { Admin, IAdmin } from '../models/admin.model';
import { Approval, IApproval } from '../models/approval.model';
import { publishMessage, KafkaTopic } from '../../../../shared/config/kafka';
import { logger } from '../../../../shared/config/logger';
import { v4 as uuidv4 } from 'uuid';

export class AdminService {
  /**
   * Get admin by user ID
   */
  async getAdminByUserId(userId: string): Promise<IAdmin | null> {
    try {
      const admin = await Admin.findOne({ userId, isActive: true });
      return admin;
    } catch (error) {
      logger.error('Error getting admin:', error);
      throw new Error('Failed to get admin');
    }
  }

  /**
   * Get dashboard stats
   */
  async getDashboardStats(): Promise<any> {
    try {
      // Mock stats - in real app, aggregate from various services
      return {
        users: {
          total: 10000,
          active: 8500,
          new: 250,
        },
        vendors: {
          total: 500,
          active: 450,
          pending: 25,
        },
        products: {
          total: 5000,
          active: 4500,
          pending: 100,
        },
        orders: {
          total: 25000,
          pending: 150,
          completed: 24500,
        },
        revenue: {
          total: 1500000,
          thisMonth: 125000,
          lastMonth: 110000,
        },
      };
    } catch (error) {
      logger.error('Error getting dashboard stats:', error);
      throw new Error('Failed to get dashboard stats');
    }
  }

  /**
   * Get pending approvals
   */
  async getPendingApprovals(type?: string, page = 1, limit = 20): Promise<any> {
    try {
      const skip = (page - 1) * limit;
      const query: any = { status: 'pending' };

      if (type) {
        query.type = type;
      }

      const [approvals, total] = await Promise.all([
        Approval.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Approval.countDocuments(query),
      ]);

      return {
        approvals,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error getting approvals:', error);
      throw new Error('Failed to get approvals');
    }
  }

  /**
   * Approve item
   */
  async approveItem(approvalId: string, adminId: string, comments?: string): Promise<IApproval | null> {
    try {
      const approval = await Approval.findOneAndUpdate(
        { approvalId },
        {
          status: 'approved',
          reviewedBy: adminId,
          reviewedAt: new Date(),
          comments,
        },
        { new: true }
      );

      if (approval) {
        // Publish event
        await publishMessage(KafkaTopic.APPROVAL_COMPLETED, {
          approvalId,
          type: approval.type,
          entityId: approval.entityId,
          status: 'approved',
          timestamp: new Date().toISOString(),
        });
      }

      return approval;
    } catch (error) {
      logger.error('Error approving item:', error);
      throw new Error('Failed to approve item');
    }
  }

  /**
   * Reject item
   */
  async rejectItem(approvalId: string, adminId: string, comments: string): Promise<IApproval | null> {
    try {
      const approval = await Approval.findOneAndUpdate(
        { approvalId },
        {
          status: 'rejected',
          reviewedBy: adminId,
          reviewedAt: new Date(),
          comments,
        },
        { new: true }
      );

      if (approval) {
        // Publish event
        await publishMessage(KafkaTopic.APPROVAL_COMPLETED, {
          approvalId,
          type: approval.type,
          entityId: approval.entityId,
          status: 'rejected',
          timestamp: new Date().toISOString(),
        });
      }

      return approval;
    } catch (error) {
      logger.error('Error rejecting item:', error);
      throw new Error('Failed to reject item');
    }
  }

  /**
   * Get system analytics
   */
  async getSystemAnalytics(period: string = '30d'): Promise<any> {
    try {
      // Mock analytics - in real app, aggregate from various services
      return {
        period,
        userGrowth: [
          { date: '2024-01-01', count: 100 },
          { date: '2024-01-02', count: 150 },
          // ... more data
        ],
        revenueGrowth: [
          { date: '2024-01-01', amount: 5000 },
          { date: '2024-01-02', amount: 6000 },
          // ... more data
        ],
        topProducts: [],
        topVendors: [],
      };
    } catch (error) {
      logger.error('Error getting analytics:', error);
      throw new Error('Failed to get analytics');
    }
  }

  /**
   * Get all users (admin view)
   */
  async getAllUsers(filters: any = {}, page = 1, limit = 20): Promise<any> {
    try {
      // Mock data - in real app, call user service or query database
      return {
        users: [],
        pagination: {
          total: 0,
          page,
          limit,
          pages: 0,
        },
      };
    } catch (error) {
      logger.error('Error getting users:', error);
      throw new Error('Failed to get users');
    }
  }

  /**
   * Update user status
   */
  async updateUserStatus(userId: string, status: string): Promise<any> {
    try {
      // Publish event to user service
      await publishMessage(KafkaTopic.USER_STATUS_UPDATED, {
        userId,
        status,
        updatedBy: 'admin',
        timestamp: new Date().toISOString(),
      });

      return { success: true };
    } catch (error) {
      logger.error('Error updating user status:', error);
      throw new Error('Failed to update user status');
    }
  }
}

export const adminService = new AdminService();

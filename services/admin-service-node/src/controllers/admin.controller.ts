/**
 * Admin Controller
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { adminService } from '../services/admin.service';
import { sendSuccess, sendError } from '../../../../shared/utils/response.util';
import { logger } from '../../../../shared/config/logger';

export class AdminController {
  async getDashboard(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const admin = await adminService.getAdminByUserId(userId);
      if (!admin) {
        return sendError(reply, 'Admin access required', 403);
      }

      const stats = await adminService.getDashboardStats();
      return sendSuccess(reply, stats, 'Dashboard stats retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getDashboard:', error);
      return sendError(reply, error.message);
    }
  }

  async getApprovals(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const admin = await adminService.getAdminByUserId(userId);
      if (!admin) {
        return sendError(reply, 'Admin access required', 403);
      }

      const { type, page = 1, limit = 20 } = req.query as any;
      const result = await adminService.getPendingApprovals(type, parseInt(page), parseInt(limit));
      return sendSuccess(reply, result, 'Approvals retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getApprovals:', error);
      return sendError(reply, error.message);
    }
  }

  async approveItem(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const admin = await adminService.getAdminByUserId(userId);
      if (!admin) {
        return sendError(reply, 'Admin access required', 403);
      }

      const { approvalId } = req.params;
      const { comments } = req.body;

      const approval = await adminService.approveItem(approvalId, admin.adminId, comments);
      if (!approval) {
        return sendError(reply, 'Approval not found', 404);
      }

      return sendSuccess(reply, approval, 'Item approved successfully');
    } catch (error: any) {
      logger.error('Error in approveItem:', error);
      return sendError(reply, error.message);
    }
  }

  async rejectItem(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const admin = await adminService.getAdminByUserId(userId);
      if (!admin) {
        return sendError(reply, 'Admin access required', 403);
      }

      const { approvalId } = req.params;
      const { comments } = req.body;

      if (!comments) {
        return sendError(reply, 'Comments required for rejection', 400);
      }

      const approval = await adminService.rejectItem(approvalId, admin.adminId, comments);
      if (!approval) {
        return sendError(reply, 'Approval not found', 404);
      }

      return sendSuccess(reply, approval, 'Item rejected successfully');
    } catch (error: any) {
      logger.error('Error in rejectItem:', error);
      return sendError(reply, error.message);
    }
  }

  async getAnalytics(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const admin = await adminService.getAdminByUserId(userId);
      if (!admin) {
        return sendError(reply, 'Admin access required', 403);
      }

      const { period = '30d' } = req.query as any;
      const analytics = await adminService.getSystemAnalytics(period);
      return sendSuccess(reply, analytics, 'Analytics retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getAnalytics:', error);
      return sendError(reply, error.message);
    }
  }

  async getUsers(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const admin = await adminService.getAdminByUserId(userId);
      if (!admin) {
        return sendError(reply, 'Admin access required', 403);
      }

      const { status, page = 1, limit = 20 } = req.query as any;
      const result = await adminService.getAllUsers({ status }, parseInt(page), parseInt(limit));
      return sendSuccess(reply, result, 'Users retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getUsers:', error);
      return sendError(reply, error.message);
    }
  }

  async updateUserStatus(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const admin = await adminService.getAdminByUserId(userId);
      if (!admin) {
        return sendError(reply, 'Admin access required', 403);
      }

      const { userId: targetUserId } = req.params;
      const { status } = req.body;

      await adminService.updateUserStatus(targetUserId, status);
      return sendSuccess(reply, null, 'User status updated successfully');
    } catch (error: any) {
      logger.error('Error in updateUserStatus:', error);
      return sendError(reply, error.message);
    }
  }
}

export const adminController = new AdminController();

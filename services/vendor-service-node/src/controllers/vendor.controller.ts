/**
 * Vendor Controller
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { vendorService } from '../services/vendor.service';
import { sendSuccess, sendError } from '../../../../shared/utils/response.util';
import { logger } from '../../../../shared/config/logger';

export class VendorController {
  async registerVendor(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const vendor = await vendorService.registerVendor(userId, req.body);
      return sendSuccess(reply, vendor, 'Vendor registered successfully', 201);
    } catch (error: any) {
      logger.error('Error in registerVendor:', error);
      return sendError(reply, error.message);
    }
  }

  async getVendor(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const vendor = await vendorService.getVendorByUserId(userId);
      if (!vendor) {
        return sendError(reply, 'Vendor not found', 404);
      }

      return sendSuccess(reply, vendor, 'Vendor retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getVendor:', error);
      return sendError(reply, error.message);
    }
  }

  async updateVendor(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const vendor = await vendorService.getVendorByUserId(userId);
      if (!vendor) {
        return sendError(reply, 'Vendor not found', 404);
      }

      const updated = await vendorService.updateVendor(vendor.vendorId, req.body);
      return sendSuccess(reply, updated, 'Vendor updated successfully');
    } catch (error: any) {
      logger.error('Error in updateVendor:', error);
      return sendError(reply, error.message);
    }
  }

  async getDashboard(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const vendor = await vendorService.getVendorByUserId(userId);
      if (!vendor) {
        return sendError(reply, 'Vendor not found', 404);
      }

      const stats = await vendorService.getDashboardStats(vendor.vendorId);
      return sendSuccess(reply, stats, 'Dashboard stats retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getDashboard:', error);
      return sendError(reply, error.message);
    }
  }

  async getAnalytics(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const vendor = await vendorService.getVendorByUserId(userId);
      if (!vendor) {
        return sendError(reply, 'Vendor not found', 404);
      }

      const { period = '30d' } = req.query as any;
      const analytics = await vendorService.getAnalytics(vendor.vendorId, period);
      return sendSuccess(reply, analytics, 'Analytics retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getAnalytics:', error);
      return sendError(reply, error.message);
    }
  }

  async requestPayout(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const vendor = await vendorService.getVendorByUserId(userId);
      if (!vendor) {
        return sendError(reply, 'Vendor not found', 404);
      }

      const { amount, method } = req.body;
      const payout = await vendorService.requestPayout(vendor.vendorId, amount, method);
      return sendSuccess(reply, payout, 'Payout requested successfully', 201);
    } catch (error: any) {
      logger.error('Error in requestPayout:', error);
      return sendError(reply, error.message);
    }
  }

  async getPayouts(req: any, reply: FastifyReply) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return sendError(reply, 'Unauthorized', 401);
      }

      const vendor = await vendorService.getVendorByUserId(userId);
      if (!vendor) {
        return sendError(reply, 'Vendor not found', 404);
      }

      const { page = 1, limit = 20 } = req.query as any;
      const result = await vendorService.getPayouts(vendor.vendorId, parseInt(page), parseInt(limit));
      return sendSuccess(reply, result, 'Payouts retrieved successfully');
    } catch (error: any) {
      logger.error('Error in getPayouts:', error);
      return sendError(reply, error.message);
    }
  }
}

export const vendorController = new VendorController();

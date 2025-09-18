import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Vendor, VendorDocument } from '../vendor/schemas/vendor.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { Order, OrderDocument } from '../order/schemas/order.schema';
import { RedisService } from '../redis/redis.service';
import { KafkaService } from '../kafka/kafka.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly kafkaService: KafkaService,
  ) {}

  // Admin Management
  async createAdmin(data: any) {
    try {
      const { email, password, firstName, lastName, role, permissions } = data;

      // Check if admin already exists
      const existingAdmin = await this.adminModel.findOne({ email });
      if (existingAdmin) {
        throw new BadRequestException('Admin with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create admin
      const admin = new this.adminModel({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'admin',
        permissions: permissions || ['read', 'write', 'delete'],
        isActive: true,
        lastLogin: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const savedAdmin = await admin.save();

      // Publish event
      await this.kafkaService.publish('admin.created', {
        adminId: savedAdmin._id,
        email: savedAdmin.email,
        role: savedAdmin.role,
        timestamp: new Date(),
      });

      this.logger.log(`Admin created: ${savedAdmin.email}`);

      return {
        success: true,
        data: this.sanitizeAdmin(savedAdmin),
        message: 'Admin created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create admin:', error);
      throw error;
    }
  }

  async getAdmins(query: any) {
    try {
      const { page = 1, limit = 10, search, role, isActive } = query;
      const skip = (page - 1) * limit;

      const filter: any = {};
      if (search) {
        filter.$or = [
          { email: { $regex: search, $options: 'i' } },
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
        ];
      }
      if (role) filter.role = role;
      if (isActive !== undefined) filter.isActive = isActive === 'true';

      const [admins, total] = await Promise.all([
        this.adminModel
          .find(filter)
          .select('-password')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.adminModel.countDocuments(filter),
      ]);

      return {
        success: true,
        data: {
          admins: admins.map(admin => this.sanitizeAdmin(admin)),
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      this.logger.error('Failed to get admins:', error);
      throw error;
    }
  }

  async getAdminById(adminId: string) {
    try {
      const admin = await this.adminModel.findById(adminId).select('-password');
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      return {
        success: true,
        data: this.sanitizeAdmin(admin),
      };
    } catch (error) {
      this.logger.error('Failed to get admin:', error);
      throw error;
    }
  }

  async updateAdmin(adminId: string, data: any) {
    try {
      const { firstName, lastName, role, permissions, isActive } = data;

      const admin = await this.adminModel.findById(adminId);
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      // Update fields
      if (firstName) admin.firstName = firstName;
      if (lastName) admin.lastName = lastName;
      if (role) admin.role = role;
      if (permissions) admin.permissions = permissions;
      if (isActive !== undefined) admin.isActive = isActive;
      admin.updatedAt = new Date();

      const updatedAdmin = await admin.save();

      // Publish event
      await this.kafkaService.publish('admin.updated', {
        adminId: updatedAdmin._id,
        changes: data,
        timestamp: new Date(),
      });

      this.logger.log(`Admin updated: ${updatedAdmin.email}`);

      return {
        success: true,
        data: this.sanitizeAdmin(updatedAdmin),
        message: 'Admin updated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to update admin:', error);
      throw error;
    }
  }

  async deleteAdmin(adminId: string) {
    try {
      const admin = await this.adminModel.findById(adminId);
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }

      await this.adminModel.findByIdAndDelete(adminId);

      // Publish event
      await this.kafkaService.publish('admin.deleted', {
        adminId: admin._id,
        email: admin.email,
        timestamp: new Date(),
      });

      this.logger.log(`Admin deleted: ${admin.email}`);

      return {
        success: true,
        message: 'Admin deleted successfully',
      };
    } catch (error) {
      this.logger.error('Failed to delete admin:', error);
      throw error;
    }
  }

  // Dashboard Statistics
  async getDashboardStats() {
    try {
      const [
        totalUsers,
        totalVendors,
        totalProducts,
        totalOrders,
        activeUsers,
        pendingVendors,
        lowStockProducts,
        recentOrders,
      ] = await Promise.all([
        this.userModel.countDocuments(),
        this.vendorModel.countDocuments(),
        this.productModel.countDocuments(),
        this.orderModel.countDocuments(),
        this.userModel.countDocuments({ isActive: true }),
        this.vendorModel.countDocuments({ status: 'pending' }),
        this.productModel.countDocuments({ stock: { $lt: 10 } }),
        this.orderModel
          .find()
          .sort({ createdAt: -1 })
          .limit(10)
          .populate('user', 'firstName lastName email')
          .populate('items.product', 'name price')
          .exec(),
      ]);

      // Calculate revenue
      const revenueResult = await this.orderModel.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]);
      const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

      // Calculate monthly revenue
      const monthlyRevenue = await this.orderModel.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]);
      const currentMonthRevenue = monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0;

      return {
        success: true,
        data: {
          overview: {
            totalUsers,
            totalVendors,
            totalProducts,
            totalOrders,
            totalRevenue,
            currentMonthRevenue,
          },
          status: {
            activeUsers,
            pendingVendors,
            lowStockProducts,
          },
          recentOrders: recentOrders.map(order => ({
            id: order._id,
            user: order.user,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt,
            items: order.items.map(item => ({
              product: item.product,
              quantity: item.quantity,
            })),
          })),
        },
      };
    } catch (error) {
      this.logger.error('Failed to get dashboard stats:', error);
      throw error;
    }
  }

  // System Health
  async getSystemHealth() {
    try {
      const health = {
        database: 'healthy',
        redis: 'healthy',
        kafka: 'healthy',
        services: {},
        timestamp: new Date(),
      };

      // Check database
      try {
        await this.adminModel.findOne().limit(1);
      } catch (error) {
        health.database = 'unhealthy';
      }

      // Check Redis
      try {
        await this.redisService.get('health-check');
      } catch (error) {
        health.redis = 'unhealthy';
      }

      // Check Kafka
      try {
        await this.kafkaService.publish('health-check', { timestamp: new Date() });
      } catch (error) {
        health.kafka = 'unhealthy';
      }

      return {
        success: true,
        data: health,
      };
    } catch (error) {
      this.logger.error('Failed to get system health:', error);
      throw error;
    }
  }

  // Helper methods
  private sanitizeAdmin(admin: any) {
    const { password, ...sanitized } = admin.toObject();
    return sanitized;
  }
}

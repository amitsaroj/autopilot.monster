import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: any): Promise<Order> {
    const orderNumber = `ORD-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    const order = new this.orderModel({
      ...createOrderDto,
      orderNumber,
      status: 'pending',
    });

    return order.save();
  }

  async findAll(userId?: string, query?: any): Promise<{ orders: Order[]; total: number; page: number; limit: number }> {
    const filter: any = {};
    
    if (userId) {
      filter.userId = new Types.ObjectId(userId);
    }

    if (query?.status) {
      filter.status = query.status;
    }

    if (query?.dateFrom || query?.dateTo) {
      filter.createdAt = {};
      if (query.dateFrom) {
        filter.createdAt.$gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        filter.createdAt.$lte = new Date(query.dateTo);
      }
    }

    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.orderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments(filter).exec(),
    ]);

    return {
      orders,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Order> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderModel.findOne({ orderNumber }).exec();
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: string, updateOrderDto: any): Promise<Order> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { ...updateOrderDto, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const updateData: any = { status, updatedAt: new Date() };

    if (status === 'shipped') {
      updateData.shippedAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    const order = await this.orderModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid order ID');
    }

    const result = await this.orderModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Order not found');
    }
  }

  async getOrderStats(userId?: string): Promise<any> {
    const filter: any = {};
    if (userId) {
      filter.userId = new Types.ObjectId(userId);
    }

    const [
      totalOrders,
      totalRevenue,
      statusStats,
      monthlyStats,
    ] = await Promise.all([
      this.orderModel.countDocuments(filter),
      this.orderModel.aggregate([
        { $match: filter },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      this.orderModel.aggregate([
        { $match: filter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      this.orderModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 },
            revenue: { $sum: '$totalAmount' }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ]),
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusStats,
      monthlyStats,
    };
  }
}

import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vendor, VendorDocument } from './schemas/vendor.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VendorService {
  constructor(
    @InjectModel(Vendor.name) private vendorModel: Model<VendorDocument>,
    private configService: ConfigService,
  ) {}

  async create(createVendorDto: any): Promise<Vendor> {
    // Check if vendor already exists
    const existingVendor = await this.vendorModel.findOne({ email: createVendorDto.email });
    if (existingVendor) {
      throw new ConflictException('Vendor with this email already exists');
    }

    // Create vendor with default values
    const vendor = new this.vendorModel({
      ...createVendorDto,
      status: 'pending',
      isVerified: false,
      isActive: true,
      kyc: {
        status: 'pending',
        documents: {},
      },
      payout: {
        method: 'bank_transfer',
        schedule: 'weekly',
        minimumAmount: this.configService.get<number>('payout.minimumPayoutAmount', 50),
        totalEarnings: 0,
        totalPayouts: 0,
        pendingAmount: 0,
      },
      commission: {
        rate: 10, // 10% default commission
        type: 'fixed',
      },
      stats: {
        totalProducts: 0,
        totalSales: 0,
        totalRevenue: 0,
        totalOrders: 0,
        averageRating: 0,
        totalReviews: 0,
        joinDate: new Date(),
        lastActivity: new Date(),
      },
      settings: {
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          showContactInfo: true,
          showSalesData: false,
        },
        autoApprove: false,
        requireApproval: true,
      },
    });

    return vendor.save();
  }

  async findAll(query: any): Promise<{ vendors: Vendor[]; total: number; page: number; limit: number }> {
    const {
      search,
      status,
      isVerified,
      isActive,
      categories,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
      dateFrom,
      dateTo,
    } = query;

    // Build filter object
    const filter: any = {};

    if (search) {
      filter.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (isVerified !== undefined) {
      filter.isVerified = isVerified;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    if (categories) {
      const categoryArray = categories.split(',').map(cat => cat.trim());
      filter.categories = { $in: categoryArray };
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const skip = (page - 1) * limit;
    const [vendors, total] = await Promise.all([
      this.vendorModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.vendorModel.countDocuments(filter).exec(),
    ]);

    return {
      vendors,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Vendor> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid vendor ID');
    }

    const vendor = await this.vendorModel.findById(id).exec();
    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async findByEmail(email: string): Promise<Vendor | null> {
    return this.vendorModel.findOne({ email }).exec();
  }

  async update(id: string, updateVendorDto: any): Promise<Vendor> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid vendor ID');
    }

    const vendor = await this.vendorModel.findByIdAndUpdate(
      id,
      { ...updateVendorDto, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async updateStatus(id: string, status: string): Promise<Vendor> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid vendor ID');
    }

    const vendor = await this.vendorModel.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: new Date(),
        ...(status === 'approved' && { isVerified: true }),
      },
      { new: true, runValidators: true }
    ).exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async updateKyc(id: string, kycData: any): Promise<Vendor> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid vendor ID');
    }

    const vendor = await this.vendorModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          'kyc': kycData,
          updatedAt: new Date() 
        } 
      },
      { new: true, runValidators: true }
    ).exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async updateBankAccount(id: string, bankAccount: any): Promise<Vendor> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid vendor ID');
    }

    const vendor = await this.vendorModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          'bankAccount': bankAccount,
          updatedAt: new Date() 
        } 
      },
      { new: true, runValidators: true }
    ).exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async updateStats(id: string, stats: any): Promise<Vendor> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid vendor ID');
    }

    const vendor = await this.vendorModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          'stats': stats,
          updatedAt: new Date() 
        } 
      },
      { new: true, runValidators: true }
    ).exec();

    if (!vendor) {
      throw new NotFoundException('Vendor not found');
    }

    return vendor;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid vendor ID');
    }

    const result = await this.vendorModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Vendor not found');
    }
  }

  async getVendorAnalytics(id: string): Promise<any> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid vendor ID');
    }

    const vendor = await this.findOne(id);
    
    // Mock analytics data - in real implementation, this would query various services
    return {
      vendorId: id,
      businessName: vendor.businessName,
      totalProducts: vendor.stats.totalProducts,
      totalSales: vendor.stats.totalSales,
      totalRevenue: vendor.stats.totalRevenue,
      averageRating: vendor.stats.averageRating,
      monthlyRevenue: [
        { month: 'Jan', revenue: 2500.00 },
        { month: 'Feb', revenue: 3200.00 },
        { month: 'Mar', revenue: 4100.00 },
      ],
      topProducts: [
        { id: '1', name: 'AI Content Generator', sales: 125, revenue: 2500.00 },
        { id: '2', name: 'Automation Workflow', sales: 98, revenue: 1960.00 },
        { id: '3', name: 'Data Analytics Tool', sales: 75, revenue: 1500.00 },
      ],
      recentOrders: [
        { id: '1', customer: 'John Doe', amount: 99.99, date: new Date() },
        { id: '2', customer: 'Jane Smith', amount: 149.99, date: new Date() },
      ],
    };
  }

  async getSystemAnalytics(): Promise<any> {
    const [
      totalVendors,
      activeVendors,
      newVendorsThisMonth,
      statusStats,
      revenueStats,
    ] = await Promise.all([
      this.vendorModel.countDocuments(),
      this.vendorModel.countDocuments({ isActive: true }),
      this.vendorModel.countDocuments({
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }),
      this.vendorModel.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      this.vendorModel.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: '$stats.totalRevenue' } } }
      ]),
    ]);

    return {
      totalVendors,
      activeVendors,
      newVendorsThisMonth,
      statusStats,
      totalRevenue: revenueStats[0]?.totalRevenue || 0,
    };
  }
}

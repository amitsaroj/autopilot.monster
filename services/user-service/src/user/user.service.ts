import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user with default values
    const user = new this.userModel({
      ...createUserDto,
      preferences: {
        notifications: {
          email: true,
          push: true,
          sms: false,
        },
        privacy: {
          profileVisibility: 'public',
          showEmail: false,
          showPhone: false,
        },
        theme: 'auto',
        language: createUserDto.language || 'en',
        timezone: createUserDto.timezone || 'UTC',
        ...createUserDto.preferences,
      },
      subscription: {
        plan: 'free',
        status: 'active',
        autoRenew: false,
      },
      stats: {
        totalOrders: 0,
        totalSpent: 0,
        totalDownloads: 0,
        totalReviews: 0,
        averageRating: 0,
        joinDate: new Date(),
        lastActivity: new Date(),
      },
      emailVerificationToken: uuidv4(),
      isActive: true,
      role: createUserDto.role || 'user',
    });

    return user.save();
  }

  async findAll(query: UserQueryDto): Promise<{ users: User[]; total: number; page: number; limit: number }> {
    const {
      search,
      role,
      subscriptionPlan,
      subscriptionStatus,
      isActive,
      isEmailVerified,
      tags,
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
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (subscriptionPlan) {
      filter['subscription.plan'] = subscriptionPlan;
    }

    if (subscriptionStatus) {
      filter['subscription.status'] = subscriptionStatus;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    if (isEmailVerified !== undefined) {
      filter.isEmailVerified = isEmailVerified;
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      filter.tags = { $in: tagArray };
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
    const [users, total] = await Promise.all([
      this.userModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return {
      users,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updatePreferences(id: string, preferences: any): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          'preferences': preferences,
          updatedAt: new Date() 
        } 
      },
      { new: true, runValidators: true }
    ).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateSubscription(id: string, subscription: any): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          'subscription': subscription,
          updatedAt: new Date() 
        } 
      },
      { new: true, runValidators: true }
    ).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateStats(id: string, stats: any): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          'stats': stats,
          updatedAt: new Date() 
        } 
      },
      { new: true, runValidators: true }
    ).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  async verifyEmail(token: string): Promise<User> {
    const user = await this.userModel.findOne({ emailVerificationToken: token }).exec();
    if (!user) {
      throw new NotFoundException('Invalid verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.updatedAt = new Date();

    return user.save();
  }

  async generatePasswordResetToken(email: string): Promise<string> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiry

    user.passwordResetToken = token;
    user.passwordResetExpires = expires;
    user.updatedAt = new Date();

    await user.save();
    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<User> {
    const user = await this.userModel.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() },
    }).exec();

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, this.configService.get<number>('security.bcryptRounds', 12));
    
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.updatedAt = new Date();

    return user.save();
  }

  async updateLastLogin(id: string, ip: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userModel.findByIdAndUpdate(
      id,
      { 
        lastLoginAt: new Date(),
        lastLoginIp: ip,
        'stats.lastActivity': new Date(),
        updatedAt: new Date() 
      },
      { new: true }
    ).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getAnalytics(): Promise<any> {
    const [
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      subscriptionStats,
      roleStats,
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ isActive: true }),
      this.userModel.countDocuments({
        createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }),
      this.userModel.aggregate([
        { $group: { _id: '$subscription.plan', count: { $sum: 1 } } }
      ]),
      this.userModel.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
    ]);

    return {
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      subscriptionStats,
      roleStats,
    };
  }
}

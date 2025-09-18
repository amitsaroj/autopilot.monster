import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('orders')
@Controller('api/v1/orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async create(@Request() req, @Body() createOrderDto: any) {
    return this.orderService.create({
      ...createOrderDto,
      userId: req.user.sub,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get user orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async findAll(@Request() req, @Query() query: any) {
    return this.orderService.findAll(req.user.sub, query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get order statistics' })
  @ApiResponse({ status: 200, description: 'Order stats retrieved successfully' })
  async getStats(@Request() req) {
    return this.orderService.getOrderStats(req.user.sub);
  }

  @Get('admin')
  @ApiOperation({ summary: 'Get all orders (admin only)' })
  @ApiResponse({ status: 200, description: 'All orders retrieved successfully' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAllAdmin(@Query() query: any) {
    return this.orderService.findAll(undefined, query);
  }

  @Get('admin/stats')
  @ApiOperation({ summary: 'Get all order statistics (admin only)' })
  @ApiResponse({ status: 200, description: 'All order stats retrieved successfully' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getStatsAdmin() {
    return this.orderService.getOrderStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Request() req, @Param('id') id: string) {
    const order = await this.orderService.findOne(id);
    
    // Check if user owns this order or is admin
    if (order.userId.toString() !== req.user.sub && req.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    
    return order;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order by ID' })
  @ApiResponse({ status: 200, description: 'Order updated successfully' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateOrderDto: any) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.orderService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order by ID' })
  @ApiResponse({ status: 200, description: 'Order deleted successfully' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.orderService.remove(id);
  }
}

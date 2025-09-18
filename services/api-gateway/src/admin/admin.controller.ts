import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get admin dashboard data' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async getUsers(@Query() query: any) {
    return this.adminService.getUsers(query);
  }

  @Get('vendors')
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiResponse({ status: 200, description: 'Vendors retrieved successfully' })
  async getVendors(@Query() query: any) {
    return this.adminService.getVendors(query);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getProducts(@Query() query: any) {
    return this.adminService.getProducts(query);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async getOrders(@Query() query: any) {
    return this.adminService.getOrders(query);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get analytics data' })
  @ApiResponse({ status: 200, description: 'Analytics data retrieved successfully' })
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }
}

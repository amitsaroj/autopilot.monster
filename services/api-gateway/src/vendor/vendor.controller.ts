import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('vendor')
@Controller('vendor')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get vendor profile' })
  @ApiResponse({ status: 200, description: 'Vendor profile retrieved successfully' })
  async getProfile(@GetUser() user: any) {
    return this.vendorService.getProfile({ vendorId: user.id });
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update vendor profile' })
  @ApiResponse({ status: 200, description: 'Vendor profile updated successfully' })
  async updateProfile(@Body() data: any, @GetUser() user: any) {
    return this.vendorService.updateProfile({ vendorId: user.id, ...data });
  }

  @Get('products')
  @ApiOperation({ summary: 'Get vendor products' })
  @ApiResponse({ status: 200, description: 'Vendor products retrieved successfully' })
  async getProducts(@Query() query: any, @GetUser() user: any) {
    return this.vendorService.getProducts({ vendorId: user.id, ...query });
  }

  @Post('products')
  @ApiOperation({ summary: 'Create new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async createProduct(@Body() data: any, @GetUser() user: any) {
    return this.vendorService.createProduct({ ...data, vendorId: user.id });
  }

  @Put('products/:id')
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async updateProduct(@Param('id') id: string, @Body() data: any, @GetUser() user: any) {
    return this.vendorService.updateProduct({ productId: id, vendorId: user.id, ...data });
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  async deleteProduct(@Param('id') id: string, @GetUser() user: any) {
    return this.vendorService.deleteProduct({ productId: id, vendorId: user.id });
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get vendor orders' })
  @ApiResponse({ status: 200, description: 'Vendor orders retrieved successfully' })
  async getOrders(@Query() query: any, @GetUser() user: any) {
    return this.vendorService.getOrders({ vendorId: user.id, ...query });
  }

  @Get('orders/:id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  async getOrder(@Param('id') id: string, @GetUser() user: any) {
    return this.vendorService.getOrder({ orderId: id, vendorId: user.id });
  }

  @Put('orders/:id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  async updateOrderStatus(@Param('id') id: string, @Body() data: any, @GetUser() user: any) {
    return this.vendorService.updateOrderStatus({ orderId: id, vendorId: user.id, ...data });
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get vendor analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getAnalytics(@Query() query: any, @GetUser() user: any) {
    return this.vendorService.getAnalytics({ vendorId: user.id, ...query });
  }

  @Get('payouts')
  @ApiOperation({ summary: 'Get vendor payouts' })
  @ApiResponse({ status: 200, description: 'Payouts retrieved successfully' })
  async getPayouts(@Query() query: any, @GetUser() user: any) {
    return this.vendorService.getPayouts({ vendorId: user.id, ...query });
  }

  @Post('payouts/request')
  @ApiOperation({ summary: 'Request payout' })
  @ApiResponse({ status: 201, description: 'Payout request created successfully' })
  async requestPayout(@Body() data: any, @GetUser() user: any) {
    return this.vendorService.requestPayout({ ...data, vendorId: user.id });
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get vendor settings' })
  @ApiResponse({ status: 200, description: 'Settings retrieved successfully' })
  async getSettings(@GetUser() user: any) {
    return this.vendorService.getSettings({ vendorId: user.id });
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update vendor settings' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  async updateSettings(@Body() data: any, @GetUser() user: any) {
    return this.vendorService.updateSettings({ vendorId: user.id, ...data });
  }

  @Post('kyc/submit')
  @ApiOperation({ summary: 'Submit KYC documents' })
  @ApiResponse({ status: 201, description: 'KYC documents submitted successfully' })
  async submitKyc(@Body() data: any, @GetUser() user: any) {
    return this.vendorService.submitKyc({ ...data, vendorId: user.id });
  }

  @Get('kyc/status')
  @ApiOperation({ summary: 'Get KYC status' })
  @ApiResponse({ status: 200, description: 'KYC status retrieved successfully' })
  async getKycStatus(@GetUser() user: any) {
    return this.vendorService.getKycStatus({ vendorId: user.id });
  }
}

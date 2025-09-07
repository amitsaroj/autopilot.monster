import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('products')
  @ApiOperation({ summary: 'Get products with filters' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getProducts(@Query() query: any) {
    return this.catalogService.getProducts(query);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  async getProduct(@Param('id') id: string, @GetUser() user: any) {
    return this.catalogService.getProduct({ productId: id, userId: user?.id });
  }

  @Post('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  async createProduct(@Body() productData: any, @GetUser() user: any) {
    return this.catalogService.createProduct({ ...productData, vendorId: user.id });
  }

  @Put('products/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  async updateProduct(@Param('id') id: string, @Body() productData: any, @GetUser() user: any) {
    return this.catalogService.updateProduct({ productId: id, vendorId: user.id, ...productData });
  }

  @Delete('products/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  async deleteProduct(@Param('id') id: string, @GetUser() user: any) {
    return this.catalogService.deleteProduct({ productId: id, vendorId: user.id });
  }

  @Post('search')
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({ status: 200, description: 'Search completed successfully' })
  async searchProducts(@Body() searchData: any) {
    return this.catalogService.searchProducts(searchData);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({ status: 200, description: 'Featured products retrieved successfully' })
  async getFeaturedProducts(@Query() query: any) {
    return this.catalogService.getFeaturedProducts(query);
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending products' })
  @ApiResponse({ status: 200, description: 'Trending products retrieved successfully' })
  async getTrendingProducts(@Query() query: any) {
    return this.catalogService.getTrendingProducts(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getCategories() {
    return this.catalogService.getCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  async getCategory(@Param('id') id: string) {
    return this.catalogService.getCategory({ categoryId: id });
  }

  @Get('vendors/:vendorId/products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get vendor products' })
  @ApiResponse({ status: 200, description: 'Vendor products retrieved successfully' })
  async getVendorProducts(@Param('vendorId') vendorId: string, @Query() query: any) {
    return this.catalogService.getVendorProducts({ vendorId, ...query });
  }

  @Post('products/:id/track-view')
  @ApiOperation({ summary: 'Track product view' })
  @ApiResponse({ status: 200, description: 'View tracked successfully' })
  async trackProductView(@Param('id') id: string, @Body() data: any) {
    return this.catalogService.trackProductView({ productId: id, ...data });
  }

  @Post('products/:id/track-download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Track product download' })
  @ApiResponse({ status: 200, description: 'Download tracked successfully' })
  async trackProductDownload(@Param('id') id: string, @Body() data: any, @GetUser() user: any) {
    return this.catalogService.trackProductDownload({ productId: id, userId: user.id, ...data });
  }

  @Get('products/:id/analytics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getProductAnalytics(@Param('id') id: string, @GetUser() user: any) {
    return this.catalogService.getProductAnalytics({ productId: id, vendorId: user.id });
  }
}

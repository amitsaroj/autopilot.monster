import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  GetProductsDto, 
  SearchProductsDto, 
  GetProductAnalyticsDto, 
  TrackProductViewDto, 
  TrackProductDownloadDto, 
  UpdateProductStatusDto, 
  DeleteProductDto 
} from './dto/catalog.dto';

@ApiTags('Catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post('products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER_ROLE_VENDOR', 'USER_ROLE_ADMIN')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createProduct(@Body() createProductDto: CreateProductDto, @Request() req) {
    return await this.catalogService.createProduct({
      ...createProductDto,
      vendorId: req.user.userId,
    });
  }

  @Get('products/:productId')
  @Public()
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProduct(@Param('productId') productId: string, @Request() req) {
    return await this.catalogService.getProduct({
      productId,
      userId: req.user?.userId,
    });
  }

  @Patch('products/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER_ROLE_VENDOR', 'USER_ROLE_ADMIN')
  @ApiOperation({ summary: 'Update product' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateProduct(
    @Param('productId') productId: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req
  ) {
    return await this.catalogService.updateProduct({
      ...updateProductDto,
      productId,
      vendorId: req.user.userId,
    });
  }

  @Delete('products/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER_ROLE_VENDOR', 'USER_ROLE_ADMIN')
  @ApiOperation({ summary: 'Delete product' })
  @ApiBearerAuth()
  @ApiBody({ type: DeleteProductDto })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteProduct(
    @Param('productId') productId: string,
    @Body() deleteProductDto: DeleteProductDto,
    @Request() req
  ) {
    return await this.catalogService.deleteProduct({
      ...deleteProductDto,
      productId,
      vendorId: req.user.userId,
    });
  }

  @Get('products')
  @Public()
  @ApiOperation({ summary: 'Get products with filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getProducts(@Query() query: GetProductsDto) {
    return await this.catalogService.getProducts(query);
  }

  @Get('products/search')
  @Public()
  @ApiOperation({ summary: 'Search products' })
  @ApiQuery({ name: 'query', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'categories', required: false, type: [String] })
  @ApiQuery({ name: 'types', required: false, type: [String] })
  @ApiQuery({ name: 'tags', required: false, type: [String] })
  @ApiQuery({ name: 'minRating', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async searchProducts(@Query() query: SearchProductsDto) {
    return await this.catalogService.searchProducts(query);
  }

  @Get('products/featured')
  @Public()
  @ApiOperation({ summary: 'Get featured products' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Featured products retrieved successfully' })
  async getFeaturedProducts(@Query() query: { limit?: number; type?: string }) {
    return await this.catalogService.getFeaturedProducts(query);
  }

  @Get('products/trending')
  @Public()
  @ApiOperation({ summary: 'Get trending products' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, type: String })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Trending products retrieved successfully' })
  async getTrendingProducts(@Query() query: { limit?: number; type?: string; days?: number }) {
    return await this.catalogService.getTrendingProducts(query);
  }

  @Get('vendors/:vendorId/products')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER_ROLE_VENDOR', 'USER_ROLE_ADMIN')
  @ApiOperation({ summary: 'Get vendor products' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Vendor products retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getVendorProducts(
    @Param('vendorId') vendorId: string,
    @Query() query: { page?: number; limit?: number; status?: string },
    @Request() req
  ) {
    // Verify vendor can only see their own products unless admin
    if (req.user.role !== 'USER_ROLE_ADMIN' && req.user.userId !== vendorId) {
      return {
        success: false,
        message: 'Unauthorized: You can only view your own products',
      };
    }

    return await this.catalogService.getVendorProducts({
      ...query,
      vendorId,
    });
  }

  @Patch('products/:productId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER_ROLE_ADMIN')
  @ApiOperation({ summary: 'Update product status (Admin only)' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateProductStatusDto })
  @ApiResponse({ status: 200, description: 'Product status updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateProductStatus(
    @Param('productId') productId: string,
    @Body() updateProductStatusDto: UpdateProductStatusDto,
    @Request() req
  ) {
    return await this.catalogService.updateProductStatus({
      ...updateProductStatusDto,
      productId,
      adminId: req.user.userId,
    });
  }

  @Get('products/:productId/analytics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER_ROLE_VENDOR', 'USER_ROLE_ADMIN')
  @ApiOperation({ summary: 'Get product analytics' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'startDate', required: false, type: Number })
  @ApiQuery({ name: 'endDate', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getProductAnalytics(
    @Param('productId') productId: string,
    @Query() query: GetProductAnalyticsDto,
    @Request() req
  ) {
    return await this.catalogService.getProductAnalytics({
      ...query,
      productId,
      vendorId: req.user.userId,
    });
  }

  @Post('products/:productId/track-view')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track product view' })
  @ApiBody({ type: TrackProductViewDto })
  @ApiResponse({ status: 200, description: 'View tracked successfully' })
  async trackProductView(
    @Param('productId') productId: string,
    @Body() trackProductViewDto: TrackProductViewDto,
    @Request() req
  ) {
    return await this.catalogService.trackProductView({
      ...trackProductViewDto,
      productId,
      userId: req.user?.userId,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  @Post('products/:productId/track-download')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Track product download' })
  @ApiBearerAuth()
  @ApiBody({ type: TrackProductDownloadDto })
  @ApiResponse({ status: 200, description: 'Download tracked successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async trackProductDownload(
    @Param('productId') productId: string,
    @Body() trackProductDownloadDto: TrackProductDownloadDto,
    @Request() req
  ) {
    return await this.catalogService.trackProductDownload({
      ...trackProductDownloadDto,
      productId,
      userId: req.user.userId,
    });
  }
}
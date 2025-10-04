import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('marketplace')
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Public()
  @Get('products')
  @ApiOperation({ summary: 'Get marketplace products with filters' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getProducts(@Query() query: any) {
    return this.marketplaceService.getProducts(query);
  }

  @Public()
  @Get('products/:id')
  @ApiOperation({ summary: 'Get product details' })
  @ApiResponse({ status: 200, description: 'Product details retrieved successfully' })
  async getProduct(@Param('id') id: string, @GetUser() user: any) {
    return this.marketplaceService.getProduct({ productId: id, userId: user?.id });
  }

  @Public()
  @Post('search')
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({ status: 200, description: 'Search completed successfully' })
  async searchProducts(@Body() searchData: any) {
    return this.marketplaceService.searchProducts(searchData);
  }

  @Public()
  @Get('search/suggestions')
  @ApiOperation({ summary: 'Get search suggestions' })
  @ApiResponse({ status: 200, description: 'Search suggestions retrieved successfully' })
  async getSearchSuggestions(@Query('q') query: string) {
    return this.marketplaceService.getSearchSuggestions(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({ status: 200, description: 'Featured products retrieved successfully' })
  async getFeaturedProducts(@Query() query: any) {
    return this.marketplaceService.getFeaturedProducts(query);
  }

  @Public()
  @Get('trending')
  @ApiOperation({ summary: 'Get trending products' })
  @ApiResponse({ status: 200, description: 'Trending products retrieved successfully' })
  async getTrendingProducts(@Query() query: any) {
    return this.marketplaceService.getTrendingProducts(query);
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get product categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getCategories() {
    return this.marketplaceService.getCategories();
  }

  @Public()
  @Get('categories/:id/products')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({ status: 200, description: 'Category products retrieved successfully' })
  async getCategoryProducts(@Param('id') id: string, @Query() query: any) {
    return this.marketplaceService.getCategoryProducts({ categoryId: id, ...query });
  }

  @Public()
  @Get('filters')
  @ApiOperation({ summary: 'Get available filters' })
  @ApiResponse({ status: 200, description: 'Filters retrieved successfully' })
  async getFilters(@Query() query: any) {
    return this.marketplaceService.getFilters(query);
  }

  @Public()
  @Get('products/:id/reviews')
  @ApiOperation({ summary: 'Get product reviews' })
  @ApiResponse({ status: 200, description: 'Product reviews retrieved successfully' })
  async getProductReviews(@Param('id') id: string, @Query() query: any) {
    return this.marketplaceService.getProductReviews({ productId: id, ...query });
  }

  @Post('products/:id/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add product review' })
  @ApiResponse({ status: 201, description: 'Review added successfully' })
  async addProductReview(@Param('id') id: string, @Body() data: any, @GetUser() user: any) {
    return this.marketplaceService.addProductReview({ productId: id, userId: user.id, ...data });
  }

  @Post('products/:id/track-view')
  @ApiOperation({ summary: 'Track product view' })
  @ApiResponse({ status: 200, description: 'View tracked successfully' })
  async trackProductView(@Param('id') id: string, @Body() data: any) {
    return this.marketplaceService.trackProductView({ productId: id, ...data });
  }

  @Post('products/:id/track-download')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Track product download' })
  @ApiResponse({ status: 200, description: 'Download tracked successfully' })
  async trackProductDownload(@Param('id') id: string, @Body() data: any, @GetUser() user: any) {
    return this.marketplaceService.trackProductDownload({ productId: id, userId: user.id, ...data });
  }

  @Public()
  @Get('vendors')
  @ApiOperation({ summary: 'Get marketplace vendors' })
  @ApiResponse({ status: 200, description: 'Vendors retrieved successfully' })
  async getVendors(@Query() query: any) {
    return this.marketplaceService.getVendors(query);
  }

  @Public()
  @Get('vendors/:id')
  @ApiOperation({ summary: 'Get vendor profile' })
  @ApiResponse({ status: 200, description: 'Vendor profile retrieved successfully' })
  async getVendor(@Param('id') id: string) {
    return this.marketplaceService.getVendor(id);
  }

  @Public()
  @Get('vendors/:id/products')
  @ApiOperation({ summary: 'Get vendor products' })
  @ApiResponse({ status: 200, description: 'Vendor products retrieved successfully' })
  async getVendorProducts(@Param('id') id: string, @Query() query: any) {
    return this.marketplaceService.getVendorProducts({ vendorId: id, ...query });
  }

  @Public()
  @Get('analytics/popular')
  @ApiOperation({ summary: 'Get popular products' })
  @ApiResponse({ status: 200, description: 'Popular products retrieved successfully' })
  async getPopularProducts(@Query() query: any) {
    return this.marketplaceService.getPopularProducts(query);
  }

  @Public()
  @Get('analytics/recent')
  @ApiOperation({ summary: 'Get recently added products' })
  @ApiResponse({ status: 200, description: 'Recent products retrieved successfully' })
  async getRecentProducts(@Query() query: any) {
    return this.marketplaceService.getRecentProducts(query);
  }

  @Public()
  @Get('analytics/stats')
  @ApiOperation({ summary: 'Get marketplace statistics' })
  @ApiResponse({ status: 200, description: 'Marketplace statistics retrieved successfully' })
  async getMarketplaceStats() {
    return this.marketplaceService.getMarketplaceStats();
  }
}

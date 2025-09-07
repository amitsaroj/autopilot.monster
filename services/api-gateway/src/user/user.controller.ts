import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@GetUser() user: any) {
    return this.userService.getProfile({ userId: user.id });
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(@Body() data: any, @GetUser() user: any) {
    return this.userService.updateProfile({ userId: user.id, ...data });
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async getOrders(@Query() query: any, @GetUser() user: any) {
    return this.userService.getOrders({ userId: user.id, ...query });
  }

  @Get('downloads')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user downloads' })
  @ApiResponse({ status: 200, description: 'Downloads retrieved successfully' })
  async getDownloads(@GetUser() user: any) {
    return this.userService.getDownloads({ userId: user.id });
  }

  @Get('wishlist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist retrieved successfully' })
  async getWishlist(@GetUser() user: any) {
    return this.userService.getWishlist({ userId: user.id });
  }

  @Post('wishlist/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add to wishlist' })
  @ApiResponse({ status: 200, description: 'Added to wishlist successfully' })
  async addToWishlist(@Param('productId') productId: string, @GetUser() user: any) {
    return this.userService.addToWishlist({ userId: user.id, productId });
  }

  @Delete('wishlist/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove from wishlist' })
  @ApiResponse({ status: 200, description: 'Removed from wishlist successfully' })
  async removeFromWishlist(@Param('productId') productId: string, @GetUser() user: any) {
    return this.userService.removeFromWishlist({ userId: user.id, productId });
  }
}

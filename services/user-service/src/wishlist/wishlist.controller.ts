import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('wishlist')
@Controller('api/v1/wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get user wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist retrieved successfully' })
  async getUserWishlist(@Request() req) {
    return this.wishlistService.getUserWishlist(req.user.sub);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiResponse({ status: 201, description: 'Product added to wishlist' })
  async addToWishlist(@Request() req, @Param('productId') productId: string, @Body() productData: any) {
    return this.wishlistService.addToWishlist(req.user.sub, productId, productData);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  @ApiResponse({ status: 200, description: 'Product removed from wishlist' })
  async removeFromWishlist(@Request() req, @Param('productId') productId: string) {
    await this.wishlistService.removeFromWishlist(req.user.sub, productId);
    return { message: 'Product removed from wishlist' };
  }

  @Delete()
  @ApiOperation({ summary: 'Clear user wishlist' })
  @ApiResponse({ status: 200, description: 'Wishlist cleared' })
  async clearWishlist(@Request() req) {
    await this.wishlistService.clearWishlist(req.user.sub);
    return { message: 'Wishlist cleared' };
  }

  @Get(':productId/check')
  @ApiOperation({ summary: 'Check if product is in wishlist' })
  @ApiResponse({ status: 200, description: 'Check result' })
  async isInWishlist(@Request() req, @Param('productId') productId: string) {
    const isInWishlist = await this.wishlistService.isInWishlist(req.user.sub, productId);
    return { isInWishlist };
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  async getCart(@GetUser() user: any) {
    return this.cartService.getCart({ userId: user.id });
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully' })
  async addToCart(@Body() data: any, @GetUser() user: any) {
    return this.cartService.addToCart({ ...data, userId: user.id });
  }

  @Put('items/:itemId')
  @ApiOperation({ summary: 'Update cart item' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  async updateCartItem(@Param('itemId') itemId: string, @Body() data: any, @GetUser() user: any) {
    return this.cartService.updateCartItem({ itemId, userId: user.id, ...data });
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully' })
  async removeFromCart(@Param('itemId') itemId: string, @GetUser() user: any) {
    return this.cartService.removeFromCart({ itemId, userId: user.id });
  }

  @Delete()
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  async clearCart(@GetUser() user: any) {
    return this.cartService.clearCart({ userId: user.id });
  }

  @Post('coupon')
  @ApiOperation({ summary: 'Apply coupon to cart' })
  @ApiResponse({ status: 200, description: 'Coupon applied successfully' })
  async applyCoupon(@Body() data: any, @GetUser() user: any) {
    return this.cartService.applyCoupon({ ...data, userId: user.id });
  }

  @Delete('coupon')
  @ApiOperation({ summary: 'Remove coupon from cart' })
  @ApiResponse({ status: 200, description: 'Coupon removed successfully' })
  async removeCoupon(@GetUser() user: any) {
    return this.cartService.removeCoupon({ userId: user.id });
  }

  @Get('summary')
  @ApiOperation({ summary: 'Get cart summary' })
  @ApiResponse({ status: 200, description: 'Cart summary retrieved successfully' })
  async getCartSummary(@GetUser() user: any) {
    return this.cartService.getCartSummary({ userId: user.id });
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate cart items' })
  @ApiResponse({ status: 200, description: 'Cart validation completed' })
  async validateCart(@GetUser() user: any) {
    return this.cartService.validateCart({ userId: user.id });
  }

  @Post('merge')
  @ApiOperation({ summary: 'Merge guest cart with user cart' })
  @ApiResponse({ status: 200, description: 'Cart merged successfully' })
  async mergeCart(@Body() data: any, @GetUser() user: any) {
    return this.cartService.mergeCart({ ...data, userId: user.id });
  }

  @Get('count')
  @ApiOperation({ summary: 'Get cart item count' })
  @ApiResponse({ status: 200, description: 'Cart count retrieved successfully' })
  async getCartCount(@GetUser() user: any) {
    return this.cartService.getCartCount({ userId: user.id });
  }
}

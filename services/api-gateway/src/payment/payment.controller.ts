import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('cart')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully' })
  async getCart(@GetUser() user: any) {
    return this.paymentService.getCart({ userId: user.id });
  }

  @Post('cart/items')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 200, description: 'Item added to cart successfully' })
  async addToCart(@Body() data: any, @GetUser() user: any) {
    return this.paymentService.addToCart({ ...data, userId: user.id });
  }

  @Put('cart/items/:itemId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update cart item' })
  @ApiResponse({ status: 200, description: 'Cart item updated successfully' })
  async updateCartItem(@Param('itemId') itemId: string, @Body() data: any, @GetUser() user: any) {
    return this.paymentService.updateCartItem({ itemId, userId: user.id, ...data });
  }

  @Delete('cart/items/:itemId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart successfully' })
  async removeFromCart(@Param('itemId') itemId: string, @GetUser() user: any) {
    return this.paymentService.removeFromCart({ itemId, userId: user.id });
  }

  @Delete('cart')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared successfully' })
  async clearCart(@GetUser() user: any) {
    return this.paymentService.clearCart({ userId: user.id });
  }

  @Post('cart/coupon')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply coupon to cart' })
  @ApiResponse({ status: 200, description: 'Coupon applied successfully' })
  async applyCoupon(@Body() data: any, @GetUser() user: any) {
    return this.paymentService.applyCoupon({ ...data, userId: user.id });
  }

  @Post('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async createOrder(@Body() data: any, @GetUser() user: any) {
    return this.paymentService.createOrder({ ...data, userId: user.id });
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async getOrders(@Query() query: any, @GetUser() user: any) {
    return this.paymentService.getOrders({ ...query, userId: user.id });
  }

  @Get('orders/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  async getOrder(@Param('id') id: string, @GetUser() user: any) {
    return this.paymentService.getOrder({ orderId: id, userId: user.id });
  }

  @Post('orders/:id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  async cancelOrder(@Param('id') id: string, @Body() data: any, @GetUser() user: any) {
    return this.paymentService.cancelOrder({ orderId: id, userId: user.id, ...data });
  }

  @Post('payment-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment intent' })
  @ApiResponse({ status: 200, description: 'Payment intent created successfully' })
  async createPaymentIntent(@Body() data: any) {
    return this.paymentService.createPaymentIntent(data);
  }

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm payment' })
  @ApiResponse({ status: 200, description: 'Payment confirmed successfully' })
  async confirmPayment(@Body() data: any) {
    return this.paymentService.confirmPayment(data);
  }

  @Get('subscriptions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user subscriptions' })
  @ApiResponse({ status: 200, description: 'Subscriptions retrieved successfully' })
  async getSubscriptions(@GetUser() user: any) {
    return this.paymentService.getSubscriptions({ userId: user.id });
  }

  @Post('subscriptions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create subscription' })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  async createSubscription(@Body() data: any, @GetUser() user: any) {
    return this.paymentService.createSubscription({ ...data, userId: user.id });
  }

  @Get('refunds')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user refunds' })
  @ApiResponse({ status: 200, description: 'Refunds retrieved successfully' })
  async getRefunds(@Query() query: any, @GetUser() user: any) {
    return this.paymentService.getRefunds({ ...query, userId: user.id });
  }

  @Post('refunds')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create refund request' })
  @ApiResponse({ status: 201, description: 'Refund request created successfully' })
  async createRefund(@Body() data: any, @GetUser() user: any) {
    return this.paymentService.createRefund({ ...data, userId: user.id });
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getPaymentAnalytics(@Query() query: any, @GetUser() user: any) {
    return this.paymentService.getPaymentAnalytics({ ...query, userId: user.id });
  }
}

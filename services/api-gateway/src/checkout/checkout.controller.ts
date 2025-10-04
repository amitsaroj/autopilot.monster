import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('checkout')
@Controller('checkout')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('initiate')
  @ApiOperation({ summary: 'Initiate checkout process' })
  @ApiResponse({ status: 201, description: 'Checkout initiated successfully' })
  async initiateCheckout(@Body() data: any, @GetUser() user: any) {
    return this.checkoutService.initiateCheckout({ ...data, userId: user.id });
  }

  @Get('session/:sessionId')
  @ApiOperation({ summary: 'Get checkout session' })
  @ApiResponse({ status: 200, description: 'Checkout session retrieved successfully' })
  async getCheckoutSession(@Param('sessionId') sessionId: string, @GetUser() user: any) {
    return this.checkoutService.getCheckoutSession({ sessionId, userId: user.id });
  }

  @Post('payment-intent')
  @ApiOperation({ summary: 'Create payment intent' })
  @ApiResponse({ status: 201, description: 'Payment intent created successfully' })
  async createPaymentIntent(@Body() data: any, @GetUser() user: any) {
    return this.checkoutService.createPaymentIntent({ ...data, userId: user.id });
  }

  @Post('payment/confirm')
  @ApiOperation({ summary: 'Confirm payment' })
  @ApiResponse({ status: 200, description: 'Payment confirmed successfully' })
  async confirmPayment(@Body() data: any, @GetUser() user: any) {
    return this.checkoutService.confirmPayment({ ...data, userId: user.id });
  }

  @Post('payment/cancel')
  @ApiOperation({ summary: 'Cancel payment' })
  @ApiResponse({ status: 200, description: 'Payment cancelled successfully' })
  async cancelPayment(@Body() data: any, @GetUser() user: any) {
    return this.checkoutService.cancelPayment({ ...data, userId: user.id });
  }

  @Get('shipping/options')
  @ApiOperation({ summary: 'Get shipping options' })
  @ApiResponse({ status: 200, description: 'Shipping options retrieved successfully' })
  async getShippingOptions(@Query() query: any, @GetUser() user: any) {
    return this.checkoutService.getShippingOptions({ ...query, userId: user.id });
  }

  @Post('shipping/calculate')
  @ApiOperation({ summary: 'Calculate shipping cost' })
  @ApiResponse({ status: 200, description: 'Shipping cost calculated successfully' })
  async calculateShipping(@Body() data: any, @GetUser() user: any) {
    return this.checkoutService.calculateShipping({ ...data, userId: user.id });
  }

  @Get('tax/calculate')
  @ApiOperation({ summary: 'Calculate tax' })
  @ApiResponse({ status: 200, description: 'Tax calculated successfully' })
  async calculateTax(@Query() query: any, @GetUser() user: any) {
    return this.checkoutService.calculateTax({ ...query, userId: user.id });
  }

  @Get('payment-methods')
  @ApiOperation({ summary: 'Get available payment methods' })
  @ApiResponse({ status: 200, description: 'Payment methods retrieved successfully' })
  async getPaymentMethods(@GetUser() user: any) {
    return this.checkoutService.getPaymentMethods({ userId: user.id });
  }

  @Post('payment-methods')
  @ApiOperation({ summary: 'Add payment method' })
  @ApiResponse({ status: 201, description: 'Payment method added successfully' })
  async addPaymentMethod(@Body() data: any, @GetUser() user: any) {
    return this.checkoutService.addPaymentMethod({ ...data, userId: user.id });
  }

  @Get('addresses')
  @ApiOperation({ summary: 'Get user addresses' })
  @ApiResponse({ status: 200, description: 'Addresses retrieved successfully' })
  async getAddresses(@GetUser() user: any) {
    return this.checkoutService.getAddresses({ userId: user.id });
  }

  @Post('addresses')
  @ApiOperation({ summary: 'Add address' })
  @ApiResponse({ status: 201, description: 'Address added successfully' })
  async addAddress(@Body() data: any, @GetUser() user: any) {
    return this.checkoutService.addAddress({ ...data, userId: user.id });
  }

  @Put('addresses/:addressId')
  @ApiOperation({ summary: 'Update address' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  async updateAddress(@Param('addressId') addressId: string, @Body() data: any, @GetUser() user: any) {
    return this.checkoutService.updateAddress({ addressId, userId: user.id, ...data });
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate checkout data' })
  @ApiResponse({ status: 200, description: 'Checkout validation completed' })
  async validateCheckout(@Body() data: any, @GetUser() user: any) {
    return this.checkoutService.validateCheckout({ ...data, userId: user.id });
  }

  @Post('complete')
  @ApiOperation({ summary: 'Complete checkout' })
  @ApiResponse({ status: 200, description: 'Checkout completed successfully' })
  async completeCheckout(@Body() data: any, @GetUser() user: any) {
    return this.checkoutService.completeCheckout({ ...data, userId: user.id });
  }

  @Get('orders/:orderId')
  @ApiOperation({ summary: 'Get order details' })
  @ApiResponse({ status: 200, description: 'Order details retrieved successfully' })
  async getOrder(@Param('orderId') orderId: string, @GetUser() user: any) {
    return this.checkoutService.getOrder({ orderId, userId: user.id });
  }

  @Post('orders/:orderId/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully' })
  async cancelOrder(@Param('orderId') orderId: string, @Body() data: any, @GetUser() user: any) {
    return this.checkoutService.cancelOrder({ orderId, userId: user.id, ...data });
  }

  @Post('orders/:orderId/refund')
  @ApiOperation({ summary: 'Request refund' })
  @ApiResponse({ status: 201, description: 'Refund requested successfully' })
  async requestRefund(@Param('orderId') orderId: string, @Body() data: any, @GetUser() user: any) {
    return this.checkoutService.requestRefund({ orderId, userId: user.id, ...data });
  }

  @Get('success/:sessionId')
  @ApiOperation({ summary: 'Handle successful payment' })
  @ApiResponse({ status: 200, description: 'Payment success handled' })
  async handlePaymentSuccess(@Param('sessionId') sessionId: string, @GetUser() user: any) {
    return this.checkoutService.handlePaymentSuccess({ sessionId, userId: user.id });
  }

  @Get('failure/:sessionId')
  @ApiOperation({ summary: 'Handle failed payment' })
  @ApiResponse({ status: 200, description: 'Payment failure handled' })
  async handlePaymentFailure(@Param('sessionId') sessionId: string, @GetUser() user: any) {
    return this.checkoutService.handlePaymentFailure({ sessionId, userId: user.id });
  }
}

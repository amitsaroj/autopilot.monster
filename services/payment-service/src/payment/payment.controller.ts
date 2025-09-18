import { Controller, Post, Get, Patch, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { 
  CreatePaymentIntentDto, 
  ConfirmPaymentDto, 
  CreateSubscriptionDto, 
  CancelSubscriptionDto, 
  GetPaymentHistoryDto, 
  GetSubscriptionHistoryDto, 
  ProcessRefundDto, 
  HandleWebhookDto 
} from './dto/payment.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create-intent')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create payment intent' })
  @ApiBearerAuth()
  @ApiBody({ type: CreatePaymentIntentDto })
  @ApiResponse({ status: 201, description: 'Payment intent created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto, @Request() req) {
    return await this.paymentService.createPaymentIntent({
      ...createPaymentIntentDto,
      userId: req.user.userId,
    });
  }

  @Post('confirm')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm payment' })
  @ApiBearerAuth()
  @ApiBody({ type: ConfirmPaymentDto })
  @ApiResponse({ status: 200, description: 'Payment confirmed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto, @Request() req) {
    return await this.paymentService.confirmPayment({
      ...confirmPaymentDto,
      userId: req.user.userId,
    });
  }

  @Post('subscription/create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create subscription' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateSubscriptionDto })
  @ApiResponse({ status: 201, description: 'Subscription created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto, @Request() req) {
    return await this.paymentService.createSubscription({
      ...createSubscriptionDto,
      userId: req.user.userId,
    });
  }

  @Patch('subscription/:subscriptionId/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiBearerAuth()
  @ApiBody({ type: CancelSubscriptionDto })
  @ApiResponse({ status: 200, description: 'Subscription cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Subscription not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async cancelSubscription(
    @Param('subscriptionId') subscriptionId: string,
    @Body() cancelSubscriptionDto: CancelSubscriptionDto,
    @Request() req
  ) {
    return await this.paymentService.cancelSubscription({
      ...cancelSubscriptionDto,
      subscriptionId,
      userId: req.user.userId,
    });
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get payment history' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'paymentMethod', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Payment history retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPaymentHistory(@Query() query: GetPaymentHistoryDto, @Request() req) {
    return await this.paymentService.getPaymentHistory({
      ...query,
      userId: req.user.userId,
    });
  }

  @Get('subscription/history')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get subscription history' })
  @ApiBearerAuth()
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Subscription history retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSubscriptionHistory(@Query() query: GetSubscriptionHistoryDto, @Request() req) {
    return await this.paymentService.getSubscriptionHistory({
      ...query,
      userId: req.user.userId,
    });
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER_ROLE_ADMIN', 'USER_ROLE_SUPER_ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Process refund (Admin only)' })
  @ApiBearerAuth()
  @ApiBody({ type: ProcessRefundDto })
  @ApiResponse({ status: 200, description: 'Refund processed successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async processRefund(@Body() processRefundDto: ProcessRefundDto, @Request() req) {
    return await this.paymentService.processRefund({
      ...processRefundDto,
      adminId: req.user.userId,
    });
  }

  @Post('webhook')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle payment webhooks' })
  @ApiBody({ type: HandleWebhookDto })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async handleWebhook(@Body() handleWebhookDto: HandleWebhookDto) {
    return await this.paymentService.handleWebhook(handleWebhookDto);
  }

  @Get('methods')
  @Public()
  @ApiOperation({ summary: 'Get available payment methods' })
  @ApiResponse({ status: 200, description: 'Payment methods retrieved successfully' })
  async getPaymentMethods() {
    return {
      success: true,
      methods: [
        {
          id: 'stripe',
          name: 'Stripe',
          description: 'Credit cards, digital wallets',
          supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
          features: ['one_time', 'subscription', 'refund'],
        },
        {
          id: 'razorpay',
          name: 'Razorpay',
          description: 'Indian payment methods',
          supportedCurrencies: ['INR'],
          features: ['one_time', 'subscription', 'refund'],
        },
      ],
    };
  }

  @Get('currencies')
  @Public()
  @ApiOperation({ summary: 'Get supported currencies' })
  @ApiResponse({ status: 200, description: 'Currencies retrieved successfully' })
  async getSupportedCurrencies() {
    return {
      success: true,
      currencies: [
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'GBP', name: 'British Pound', symbol: '£' },
        { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
        { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
        { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
      ],
    };
  }
}

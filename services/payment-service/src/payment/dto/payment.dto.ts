import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, IsObject, Min, Max } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'USD', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ 
    example: 'stripe',
    enum: ['stripe', 'razorpay']
  })
  @IsEnum(['stripe', 'razorpay'])
  paymentMethod: string;

  @ApiProperty({ example: '64f8a1b2c3d4e5f6a7b8c9d0', required: false })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class ConfirmPaymentDto {
  @ApiProperty({ example: '64f8a1b2c3d4e5f6a7b8c9d0' })
  @IsString()
  paymentId: string;

  @ApiProperty({ 
    example: 'stripe',
    enum: ['stripe', 'razorpay']
  })
  @IsEnum(['stripe', 'razorpay'])
  paymentMethod: string;

  @ApiProperty({ example: 'pi_1234567890', required: false })
  @IsOptional()
  @IsString()
  paymentIntentId?: string;

  @ApiProperty({ example: 'pay_1234567890', required: false })
  @IsOptional()
  @IsString()
  razorpayPaymentId?: string;

  @ApiProperty({ example: 'signature_hash', required: false })
  @IsOptional()
  @IsString()
  razorpaySignature?: string;
}

export class CreateSubscriptionDto {
  @ApiProperty({ example: 'plan_123' })
  @IsString()
  planId: string;

  @ApiProperty({ example: 'Pro Plan' })
  @IsString()
  planName: string;

  @ApiProperty({ example: 29.99 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'USD', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ 
    example: 'monthly',
    enum: ['monthly', 'yearly', 'lifetime']
  })
  @IsEnum(['monthly', 'yearly', 'lifetime'])
  interval: string;

  @ApiProperty({ 
    example: 'stripe',
    enum: ['stripe', 'razorpay']
  })
  @IsEnum(['stripe', 'razorpay'])
  paymentMethod: string;

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class CancelSubscriptionDto {
  @ApiProperty({ example: 'User requested cancellation' })
  @IsString()
  reason: string;
}

export class GetPaymentHistoryDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ 
    example: 'PAYMENT_STATUS_COMPLETED',
    enum: ['PAYMENT_STATUS_PENDING', 'PAYMENT_STATUS_COMPLETED', 'PAYMENT_STATUS_FAILED', 'PAYMENT_STATUS_CANCELLED', 'PAYMENT_STATUS_REFUNDED'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['PAYMENT_STATUS_PENDING', 'PAYMENT_STATUS_COMPLETED', 'PAYMENT_STATUS_FAILED', 'PAYMENT_STATUS_CANCELLED', 'PAYMENT_STATUS_REFUNDED'])
  status?: string;

  @ApiProperty({ 
    example: 'stripe',
    enum: ['stripe', 'razorpay', 'paypal', 'bank_transfer'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['stripe', 'razorpay', 'paypal', 'bank_transfer'])
  paymentMethod?: string;
}

export class GetSubscriptionHistoryDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ 
    example: 'SUBSCRIPTION_STATUS_ACTIVE',
    enum: ['SUBSCRIPTION_STATUS_PENDING', 'SUBSCRIPTION_STATUS_ACTIVE', 'SUBSCRIPTION_STATUS_CANCELLED', 'SUBSCRIPTION_STATUS_EXPIRED', 'SUBSCRIPTION_STATUS_PAST_DUE'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['SUBSCRIPTION_STATUS_PENDING', 'SUBSCRIPTION_STATUS_ACTIVE', 'SUBSCRIPTION_STATUS_CANCELLED', 'SUBSCRIPTION_STATUS_EXPIRED', 'SUBSCRIPTION_STATUS_PAST_DUE'])
  status?: string;
}

export class ProcessRefundDto {
  @ApiProperty({ example: '64f8a1b2c3d4e5f6a7b8c9d0' })
  @IsString()
  paymentId: string;

  @ApiProperty({ example: 50.00, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @ApiProperty({ example: 'Customer requested refund' })
  @IsString()
  reason: string;
}

export class HandleWebhookDto {
  @ApiProperty({ 
    example: 'stripe',
    enum: ['stripe', 'razorpay']
  })
  @IsEnum(['stripe', 'razorpay'])
  provider: string;

  @ApiProperty({ type: Object })
  @IsObject()
  payload: any;

  @ApiProperty({ example: 'webhook_signature_hash' })
  @IsString()
  signature: string;
}

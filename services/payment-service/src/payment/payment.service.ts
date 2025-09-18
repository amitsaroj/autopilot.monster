import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import Razorpay from 'razorpay';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Order, OrderDocument } from './schemas/order.schema';
import { Subscription, SubscriptionDocument } from './schemas/subscription.schema';
import { KafkaService } from '../kafka/kafka.service';
import { RedisService } from '../redis/redis.service';
import { randomBytes } from 'crypto';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private stripe: Stripe;
  private razorpay: Razorpay;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Subscription.name) private subscriptionModel: Model<SubscriptionDocument>,
    private configService: ConfigService,
    private kafkaService: KafkaService,
    private redisService: RedisService,
  ) {
    // Initialize Stripe
    this.stripe = new Stripe(this.configService.get('stripe.secretKey'), {
      apiVersion: '2023-10-16',
    });

    // Initialize Razorpay
    this.razorpay = new Razorpay({
      key_id: this.configService.get('razorpay.keyId'),
      key_secret: this.configService.get('razorpay.keySecret'),
    });
  }

  async createPaymentIntent(data: any) {
    try {
      const { userId, amount, currency, paymentMethod, orderId, metadata } = data;

      // Validate amount
      if (amount <= 0) {
        return {
          success: false,
          message: 'Invalid amount',
        };
      }

      // Create payment record
      const payment = new this.paymentModel({
        userId,
        orderId,
        amount,
        currency: currency || 'USD',
        status: 'PAYMENT_STATUS_PENDING',
        paymentMethod,
        metadata: metadata || {},
        paymentIntentId: null,
        clientSecret: null,
      });

      await payment.save();

      let paymentIntent;
      let clientSecret;

      if (paymentMethod === 'stripe') {
        // Create Stripe payment intent
        paymentIntent = await this.stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency || 'usd',
          metadata: {
            paymentId: payment._id.toString(),
            userId,
            orderId,
            ...metadata,
          },
          automatic_payment_methods: {
            enabled: true,
          },
        });

        clientSecret = paymentIntent.client_secret;
        payment.paymentIntentId = paymentIntent.id;
        payment.clientSecret = clientSecret;
      } else if (paymentMethod === 'razorpay') {
        // Create Razorpay order
        const razorpayOrder = await this.razorpay.orders.create({
          amount: Math.round(amount * 100), // Convert to paise
          currency: currency || 'INR',
          receipt: payment._id.toString(),
          notes: {
            paymentId: payment._id.toString(),
            userId,
            orderId,
            ...metadata,
          },
        });

        payment.paymentIntentId = razorpayOrder.id;
        payment.clientSecret = razorpayOrder.id;
        clientSecret = razorpayOrder.id;
      }

      await payment.save();

      // Cache payment intent for quick access
      await this.redisService.setCache(
        `payment_intent:${payment._id}`,
        { paymentIntent, clientSecret },
        3600 // 1 hour
      );

      this.logger.log(`Payment intent created: ${payment._id} for user: ${userId}`);

      return {
        success: true,
        paymentId: payment._id.toString(),
        clientSecret,
        amount,
        currency: currency || 'USD',
      };
    } catch (error) {
      this.logger.error('Create payment intent failed:', error);
      return {
        success: false,
        message: error.message || 'Failed to create payment intent',
      };
    }
  }

  async confirmPayment(data: any) {
    try {
      const { paymentId, paymentMethod, paymentIntentId, razorpayPaymentId, razorpaySignature } = data;

      const payment = await this.paymentModel.findById(paymentId);
      if (!payment) {
        return {
          success: false,
          message: 'Payment not found',
        };
      }

      if (payment.status !== 'PAYMENT_STATUS_PENDING') {
        return {
          success: false,
          message: 'Payment is not in pending status',
        };
      }

      let isConfirmed = false;
      let transactionId = null;

      if (paymentMethod === 'stripe') {
        // Confirm Stripe payment
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status === 'succeeded') {
          isConfirmed = true;
          transactionId = paymentIntent.id;
        }
      } else if (paymentMethod === 'razorpay') {
        // Verify Razorpay payment
        const crypto = require('crypto');
        const body = razorpayPaymentId + '|' + payment.paymentIntentId;
        const expectedSignature = crypto
          .createHmac('sha256', this.configService.get('razorpay.webhookSecret'))
          .update(body.toString())
          .digest('hex');

        if (expectedSignature === razorpaySignature) {
          isConfirmed = true;
          transactionId = razorpayPaymentId;
        }
      }

      if (isConfirmed) {
        payment.status = 'PAYMENT_STATUS_COMPLETED';
        payment.transactionId = transactionId;
        payment.completedAt = new Date();
        await payment.save();

        // Update order status
        if (payment.orderId) {
          await this.orderModel.findByIdAndUpdate(payment.orderId, {
            status: 'ORDER_STATUS_PAID',
            paymentId: payment._id,
          });
        }

        // Publish payment success event
        await this.kafkaService.publishPaymentEvent('payment.completed', payment._id.toString(), {
          userId: payment.userId,
          orderId: payment.orderId,
          amount: payment.amount,
          currency: payment.currency,
          transactionId,
        });

        this.logger.log(`Payment confirmed: ${payment._id}`);

        return {
          success: true,
          message: 'Payment confirmed successfully',
          payment: this.formatPayment(payment),
        };
      } else {
        payment.status = 'PAYMENT_STATUS_FAILED';
        payment.failedAt = new Date();
        await payment.save();

        return {
          success: false,
          message: 'Payment verification failed',
        };
      }
    } catch (error) {
      this.logger.error('Confirm payment failed:', error);
      return {
        success: false,
        message: 'Failed to confirm payment',
      };
    }
  }

  async createSubscription(data: any) {
    try {
      const { userId, planId, planName, amount, currency, interval, paymentMethod, metadata } = data;

      // Create subscription record
      const subscription = new this.subscriptionModel({
        userId,
        planId,
        planName,
        amount,
        currency: currency || 'USD',
        interval,
        status: 'SUBSCRIPTION_STATUS_PENDING',
        paymentMethod,
        metadata: metadata || {},
        stripeSubscriptionId: null,
        razorpaySubscriptionId: null,
        currentPeriodStart: new Date(),
        currentPeriodEnd: this.calculatePeriodEnd(new Date(), interval),
      });

      await subscription.save();

      let subscriptionId;
      let clientSecret;

      if (paymentMethod === 'stripe') {
        // Create Stripe subscription
        const stripeSubscription = await this.stripe.subscriptions.create({
          customer: await this.getOrCreateStripeCustomer(userId),
          items: [{
            price_data: {
              currency: currency || 'usd',
              product_data: {
                name: planName,
              },
              unit_amount: Math.round(amount * 100),
              recurring: {
                interval: interval === 'monthly' ? 'month' : 'year',
              },
            },
          }],
          metadata: {
            subscriptionId: subscription._id.toString(),
            userId,
            planId,
          },
          payment_behavior: 'default_incomplete',
          payment_settings: { save_default_payment_method: 'on_subscription' },
          expand: ['latest_invoice.payment_intent'],
        });

        subscriptionId = stripeSubscription.id;
        clientSecret = (stripeSubscription.latest_invoice as any)?.payment_intent?.client_secret;
        subscription.stripeSubscriptionId = subscriptionId;
      } else if (paymentMethod === 'razorpay') {
        // Create Razorpay subscription
        const razorpaySubscription = await this.razorpay.subscriptions.create({
          plan_id: planId,
          customer_notify: 1,
          quantity: 1,
          total_count: 12, // 12 months
          notes: {
            subscriptionId: subscription._id.toString(),
            userId,
            planName,
          },
        });

        subscriptionId = razorpaySubscription.id;
        subscription.razorpaySubscriptionId = subscriptionId;
      }

      await subscription.save();

      this.logger.log(`Subscription created: ${subscription._id} for user: ${userId}`);

      return {
        success: true,
        subscriptionId: subscription._id.toString(),
        externalSubscriptionId: subscriptionId,
        clientSecret,
        amount,
        currency: currency || 'USD',
        interval,
      };
    } catch (error) {
      this.logger.error('Create subscription failed:', error);
      return {
        success: false,
        message: error.message || 'Failed to create subscription',
      };
    }
  }

  async cancelSubscription(data: any) {
    try {
      const { subscriptionId, reason } = data;

      const subscription = await this.subscriptionModel.findById(subscriptionId);
      if (!subscription) {
        return {
          success: false,
          message: 'Subscription not found',
        };
      }

      if (subscription.status === 'SUBSCRIPTION_STATUS_CANCELLED') {
        return {
          success: false,
          message: 'Subscription is already cancelled',
        };
      }

      // Cancel with payment provider
      if (subscription.paymentMethod === 'stripe' && subscription.stripeSubscriptionId) {
        await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });
      } else if (subscription.paymentMethod === 'razorpay' && subscription.razorpaySubscriptionId) {
        await this.razorpay.subscriptions.cancel(subscription.razorpaySubscriptionId);
      }

      subscription.status = 'SUBSCRIPTION_STATUS_CANCELLED';
      subscription.cancelledAt = new Date();
      subscription.cancellationReason = reason;
      await subscription.save();

      // Publish cancellation event
      await this.kafkaService.publishPaymentEvent('subscription.cancelled', subscriptionId, {
        userId: subscription.userId,
        planId: subscription.planId,
        reason,
      });

      this.logger.log(`Subscription cancelled: ${subscriptionId}`);

      return {
        success: true,
        message: 'Subscription cancelled successfully',
        subscription: this.formatSubscription(subscription),
      };
    } catch (error) {
      this.logger.error('Cancel subscription failed:', error);
      return {
        success: false,
        message: 'Failed to cancel subscription',
      };
    }
  }

  async getPaymentHistory(data: any) {
    try {
      const { userId, page = 1, limit = 10, status, paymentMethod } = data;

      const query: any = { userId };
      if (status && status !== 'PAYMENT_STATUS_UNSPECIFIED') query.status = status;
      if (paymentMethod) query.paymentMethod = paymentMethod;

      const total = await this.paymentModel.countDocuments(query);
      const payments = await this.paymentModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      return {
        success: true,
        payments: payments.map(payment => this.formatPayment(payment)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Get payment history failed:', error);
      return {
        success: false,
        message: 'Failed to get payment history',
      };
    }
  }

  async getSubscriptionHistory(data: any) {
    try {
      const { userId, page = 1, limit = 10, status } = data;

      const query: any = { userId };
      if (status && status !== 'SUBSCRIPTION_STATUS_UNSPECIFIED') query.status = status;

      const total = await this.subscriptionModel.countDocuments(query);
      const subscriptions = await this.subscriptionModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      return {
        success: true,
        subscriptions: subscriptions.map(subscription => this.formatSubscription(subscription)),
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error('Get subscription history failed:', error);
      return {
        success: false,
        message: 'Failed to get subscription history',
      };
    }
  }

  async processRefund(data: any) {
    try {
      const { paymentId, amount, reason, adminId } = data;

      const payment = await this.paymentModel.findById(paymentId);
      if (!payment) {
        return {
          success: false,
          message: 'Payment not found',
        };
      }

      if (payment.status !== 'PAYMENT_STATUS_COMPLETED') {
        return {
          success: false,
          message: 'Payment is not completed',
        };
      }

      const refundAmount = amount || payment.amount;
      let refundId;

      if (payment.paymentMethod === 'stripe') {
        const refund = await this.stripe.refunds.create({
          payment_intent: payment.transactionId,
          amount: Math.round(refundAmount * 100),
          reason: 'requested_by_customer',
          metadata: {
            paymentId: payment._id.toString(),
            reason,
            adminId,
          },
        });
        refundId = refund.id;
      } else if (payment.paymentMethod === 'razorpay') {
        const refund = await this.razorpay.payments.refund(payment.transactionId, {
          amount: Math.round(refundAmount * 100),
          notes: {
            paymentId: payment._id.toString(),
            reason,
            adminId,
          },
        });
        refundId = refund.id;
      }

      // Create refund record
      const refund = new this.paymentModel({
        userId: payment.userId,
        orderId: payment.orderId,
        amount: -refundAmount, // Negative amount for refund
        currency: payment.currency,
        status: 'PAYMENT_STATUS_COMPLETED',
        paymentMethod: payment.paymentMethod,
        transactionId: refundId,
        refundFor: payment._id,
        metadata: {
          reason,
          adminId,
          originalPaymentId: payment._id.toString(),
        },
        completedAt: new Date(),
      });

      await refund.save();

      // Publish refund event
      await this.kafkaService.publishPaymentEvent('payment.refunded', refund._id.toString(), {
        userId: payment.userId,
        orderId: payment.orderId,
        amount: refundAmount,
        reason,
        adminId,
      });

      this.logger.log(`Refund processed: ${refund._id} for payment: ${paymentId}`);

      return {
        success: true,
        message: 'Refund processed successfully',
        refundId: refund._id.toString(),
        amount: refundAmount,
      };
    } catch (error) {
      this.logger.error('Process refund failed:', error);
      return {
        success: false,
        message: 'Failed to process refund',
      };
    }
  }

  async handleWebhook(data: any) {
    try {
      const { provider, payload, signature } = data;

      if (provider === 'stripe') {
        return await this.handleStripeWebhook(payload, signature);
      } else if (provider === 'razorpay') {
        return await this.handleRazorpayWebhook(payload, signature);
      }

      return {
        success: false,
        message: 'Unsupported payment provider',
      };
    } catch (error) {
      this.logger.error('Handle webhook failed:', error);
      return {
        success: false,
        message: 'Webhook processing failed',
      };
    }
  }

  // Helper methods
  private async getOrCreateStripeCustomer(userId: string): Promise<string> {
    // This would typically fetch from user service
    // For now, create a new customer
    const customer = await this.stripe.customers.create({
      metadata: { userId },
    });
    return customer.id;
  }

  private calculatePeriodEnd(startDate: Date, interval: string): Date {
    const endDate = new Date(startDate);
    if (interval === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (interval === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    return endDate;
  }

  private async handleStripeWebhook(payload: any, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.configService.get('stripe.webhookSecret')
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handleStripePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handleStripePaymentFailed(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handleStripeSubscriptionPayment(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleStripeSubscriptionCancelled(event.data.object);
          break;
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Stripe webhook error:', error);
      return { success: false, message: error.message };
    }
  }

  private async handleRazorpayWebhook(payload: any, signature: string) {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', this.configService.get('razorpay.webhookSecret'))
        .update(JSON.stringify(payload))
        .digest('hex');

      if (expectedSignature !== signature) {
        throw new Error('Invalid signature');
      }

      const event = payload.event;
      const payment = payload.payload.payment?.entity;

      switch (event) {
        case 'payment.captured':
          await this.handleRazorpayPaymentSuccess(payment);
          break;
        case 'payment.failed':
          await this.handleRazorpayPaymentFailed(payment);
          break;
      }

      return { success: true };
    } catch (error) {
      this.logger.error('Razorpay webhook error:', error);
      return { success: false, message: error.message };
    }
  }

  private async handleStripePaymentSuccess(paymentIntent: any) {
    const payment = await this.paymentModel.findOne({
      paymentIntentId: paymentIntent.id,
    });

    if (payment && payment.status === 'PAYMENT_STATUS_PENDING') {
      payment.status = 'PAYMENT_STATUS_COMPLETED';
      payment.transactionId = paymentIntent.id;
      payment.completedAt = new Date();
      await payment.save();

      await this.kafkaService.publishPaymentEvent('payment.completed', payment._id.toString(), {
        userId: payment.userId,
        orderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
      });
    }
  }

  private async handleStripePaymentFailed(paymentIntent: any) {
    const payment = await this.paymentModel.findOne({
      paymentIntentId: paymentIntent.id,
    });

    if (payment && payment.status === 'PAYMENT_STATUS_PENDING') {
      payment.status = 'PAYMENT_STATUS_FAILED';
      payment.failedAt = new Date();
      await payment.save();

      await this.kafkaService.publishPaymentEvent('payment.failed', payment._id.toString(), {
        userId: payment.userId,
        orderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
      });
    }
  }

  private async handleStripeSubscriptionPayment(invoice: any) {
    // Handle subscription payment success
    this.logger.log(`Subscription payment succeeded: ${invoice.id}`);
  }

  private async handleStripeSubscriptionCancelled(subscription: any) {
    // Handle subscription cancellation
    this.logger.log(`Subscription cancelled: ${subscription.id}`);
  }

  private async handleRazorpayPaymentSuccess(payment: any) {
    // Handle Razorpay payment success
    this.logger.log(`Razorpay payment succeeded: ${payment.id}`);
  }

  private async handleRazorpayPaymentFailed(payment: any) {
    // Handle Razorpay payment failure
    this.logger.log(`Razorpay payment failed: ${payment.id}`);
  }

  private formatPayment(payment: any) {
    return {
      id: payment._id?.toString() || payment.id,
      userId: payment.userId,
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      paymentIntentId: payment.paymentIntentId,
      clientSecret: payment.clientSecret,
      metadata: payment.metadata,
      createdAt: payment.createdAt,
      completedAt: payment.completedAt,
      failedAt: payment.failedAt,
    };
  }

  private formatSubscription(subscription: any) {
    return {
      id: subscription._id?.toString() || subscription.id,
      userId: subscription.userId,
      planId: subscription.planId,
      planName: subscription.planName,
      amount: subscription.amount,
      currency: subscription.currency,
      interval: subscription.interval,
      status: subscription.status,
      paymentMethod: subscription.paymentMethod,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      razorpaySubscriptionId: subscription.razorpaySubscriptionId,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelledAt: subscription.cancelledAt,
      cancellationReason: subscription.cancellationReason,
      metadata: subscription.metadata,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}

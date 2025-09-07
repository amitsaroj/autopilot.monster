import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

interface PaymentServiceGrpc {
  getCart(data: any): Promise<any>;
  addToCart(data: any): Promise<any>;
  updateCartItem(data: any): Promise<any>;
  removeFromCart(data: any): Promise<any>;
  clearCart(data: any): Promise<any>;
  applyCoupon(data: any): Promise<any>;
  createOrder(data: any): Promise<any>;
  getOrder(data: any): Promise<any>;
  getOrders(data: any): Promise<any>;
  cancelOrder(data: any): Promise<any>;
  createPaymentIntent(data: any): Promise<any>;
  confirmPayment(data: any): Promise<any>;
  getSubscriptions(data: any): Promise<any>;
  createSubscription(data: any): Promise<any>;
  getRefunds(data: any): Promise<any>;
  createRefund(data: any): Promise<any>;
  getPaymentAnalytics(data: any): Promise<any>;
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private paymentService: PaymentServiceGrpc;

  constructor(
    @Inject('PAYMENT_PACKAGE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentService = this.client.getService<PaymentServiceGrpc>('PaymentService');
  }

  async getCart(data: any) {
    try {
      return await this.paymentService.getCart(data);
    } catch (error) {
      this.logger.error('Get cart failed:', error);
      return {
        success: false,
        message: 'Failed to get cart',
      };
    }
  }

  async addToCart(data: any) {
    try {
      return await this.paymentService.addToCart(data);
    } catch (error) {
      this.logger.error('Add to cart failed:', error);
      return {
        success: false,
        message: 'Failed to add to cart',
      };
    }
  }

  async updateCartItem(data: any) {
    try {
      return await this.paymentService.updateCartItem(data);
    } catch (error) {
      this.logger.error('Update cart item failed:', error);
      return {
        success: false,
        message: 'Failed to update cart item',
      };
    }
  }

  async removeFromCart(data: any) {
    try {
      return await this.paymentService.removeFromCart(data);
    } catch (error) {
      this.logger.error('Remove from cart failed:', error);
      return {
        success: false,
        message: 'Failed to remove from cart',
      };
    }
  }

  async clearCart(data: any) {
    try {
      return await this.paymentService.clearCart(data);
    } catch (error) {
      this.logger.error('Clear cart failed:', error);
      return {
        success: false,
        message: 'Failed to clear cart',
      };
    }
  }

  async applyCoupon(data: any) {
    try {
      return await this.paymentService.applyCoupon(data);
    } catch (error) {
      this.logger.error('Apply coupon failed:', error);
      return {
        success: false,
        message: 'Failed to apply coupon',
      };
    }
  }

  async createOrder(data: any) {
    try {
      return await this.paymentService.createOrder(data);
    } catch (error) {
      this.logger.error('Create order failed:', error);
      return {
        success: false,
        message: 'Failed to create order',
      };
    }
  }

  async getOrder(data: any) {
    try {
      return await this.paymentService.getOrder(data);
    } catch (error) {
      this.logger.error('Get order failed:', error);
      return {
        success: false,
        message: 'Failed to get order',
      };
    }
  }

  async getOrders(data: any) {
    try {
      return await this.paymentService.getOrders(data);
    } catch (error) {
      this.logger.error('Get orders failed:', error);
      return {
        success: false,
        message: 'Failed to get orders',
      };
    }
  }

  async cancelOrder(data: any) {
    try {
      return await this.paymentService.cancelOrder(data);
    } catch (error) {
      this.logger.error('Cancel order failed:', error);
      return {
        success: false,
        message: 'Failed to cancel order',
      };
    }
  }

  async createPaymentIntent(data: any) {
    try {
      return await this.paymentService.createPaymentIntent(data);
    } catch (error) {
      this.logger.error('Create payment intent failed:', error);
      return {
        success: false,
        message: 'Failed to create payment intent',
      };
    }
  }

  async confirmPayment(data: any) {
    try {
      return await this.paymentService.confirmPayment(data);
    } catch (error) {
      this.logger.error('Confirm payment failed:', error);
      return {
        success: false,
        message: 'Failed to confirm payment',
      };
    }
  }

  async getSubscriptions(data: any) {
    try {
      return await this.paymentService.getSubscriptions(data);
    } catch (error) {
      this.logger.error('Get subscriptions failed:', error);
      return {
        success: false,
        message: 'Failed to get subscriptions',
      };
    }
  }

  async createSubscription(data: any) {
    try {
      return await this.paymentService.createSubscription(data);
    } catch (error) {
      this.logger.error('Create subscription failed:', error);
      return {
        success: false,
        message: 'Failed to create subscription',
      };
    }
  }

  async getRefunds(data: any) {
    try {
      return await this.paymentService.getRefunds(data);
    } catch (error) {
      this.logger.error('Get refunds failed:', error);
      return {
        success: false,
        message: 'Failed to get refunds',
      };
    }
  }

  async createRefund(data: any) {
    try {
      return await this.paymentService.createRefund(data);
    } catch (error) {
      this.logger.error('Create refund failed:', error);
      return {
        success: false,
        message: 'Failed to create refund',
      };
    }
  }

  async getPaymentAnalytics(data: any) {
    try {
      return await this.paymentService.getPaymentAnalytics(data);
    } catch (error) {
      this.logger.error('Get payment analytics failed:', error);
      return {
        success: false,
        message: 'Failed to get analytics',
      };
    }
  }
}

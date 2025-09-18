import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  orderNumber: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop({ 
    type: String, 
    enum: ['ORDER_STATUS_PENDING', 'ORDER_STATUS_PAID', 'ORDER_STATUS_PROCESSING', 'ORDER_STATUS_SHIPPED', 'ORDER_STATUS_DELIVERED', 'ORDER_STATUS_CANCELLED', 'ORDER_STATUS_REFUNDED'],
    default: 'ORDER_STATUS_PENDING'
  })
  status: string;

  @Prop({ type: [Object] })
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }>;

  @Prop({ type: Object })
  shippingAddress?: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };

  @Prop({ type: Object })
  billingAddress?: {
    firstName: string;
    lastName: string;
    company?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };

  @Prop()
  paymentId?: string;

  @Prop({ type: Object })
  discounts?: {
    code?: string;
    amount: number;
    type: string; // 'percentage' | 'fixed'
  };

  @Prop({ type: Object })
  taxes?: {
    amount: number;
    rate: number;
    type: string;
  };

  @Prop({ type: Object })
  shipping?: {
    method: string;
    cost: number;
    trackingNumber?: string;
    estimatedDelivery?: Date;
  };

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  notes?: string;

  @Prop()
  processedAt?: Date;

  @Prop()
  shippedAt?: Date;

  @Prop()
  deliveredAt?: Date;

  @Prop()
  cancelledAt?: Date;

  @Prop()
  refundedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Indexes
OrderSchema.index({ userId: 1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentId: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ processedAt: -1 });

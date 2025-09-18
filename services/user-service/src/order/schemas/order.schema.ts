import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  orderNumber: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ type: [Object] })
  items: {
    productId: Types.ObjectId;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }[];

  @Prop({ type: Object })
  billing: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };

  @Prop({ type: Object })
  payment: {
    method: string;
    transactionId?: string;
    status: string;
    paidAt?: Date;
  };

  @Prop()
  notes?: string;

  @Prop()
  trackingNumber?: string;

  @Prop()
  shippedAt?: Date;

  @Prop()
  deliveredAt?: Date;

  @Prop({ type: Object })
  metadata: Record<string, any>;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Indexes
OrderSchema.index({ userId: 1 });
OrderSchema.index({ orderNumber: 1 }, { unique: true });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ 'payment.status': 1 });

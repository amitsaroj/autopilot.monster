import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  vendorId: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ 
    type: String, 
    enum: ['PRODUCT_TYPE_AI_AGENT', 'PRODUCT_TYPE_N8N_WORKFLOW', 'PRODUCT_TYPE_AUTOMATION_TEMPLATE', 'PRODUCT_TYPE_API_INTEGRATION', 'PRODUCT_TYPE_CHATBOT', 'PRODUCT_TYPE_DATASET'],
    required: true 
  })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({
    type: {
      type: {
        type: String,
        enum: ['PRICING_TYPE_FREE', 'PRICING_TYPE_ONE_TIME', 'PRICING_TYPE_SUBSCRIPTION', 'PRICING_TYPE_TIERED'],
        required: true
      },
      price: { type: Number, default: 0 },
      discountPrice: { type: Number },
      discountUntil: { type: Date },
      currency: { type: String, default: 'USD' },
      tiers: [{
        name: String,
        description: String,
        price: Number,
        features: { type: Map, of: String }
      }]
    },
    required: true
  })
  pricing: {
    type: string;
    price: number;
    discountPrice?: number;
    discountUntil?: Date;
    currency: string;
    tiers?: Array<{
      name: string;
      description: string;
      price: number;
      features: Map<string, string>;
    }>;
  };

  @Prop([{
    id: String,
    name: String,
    description: String,
    fileUrl: String,
    fileType: String,
    fileSize: Number,
    checksum: String,
    downloadCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }])
  files: Array<{
    id: string;
    name: string;
    description: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    checksum: string;
    downloadCount: number;
    createdAt: Date;
  }>;

  @Prop({ type: [String], default: [] })
  screenshots: string[];

  @Prop({ 
    type: String, 
    enum: ['PRODUCT_STATUS_DRAFT', 'PRODUCT_STATUS_PENDING_REVIEW', 'PRODUCT_STATUS_APPROVED', 'PRODUCT_STATUS_REJECTED', 'PRODUCT_STATUS_SUSPENDED', 'PRODUCT_STATUS_ARCHIVED'],
    default: 'PRODUCT_STATUS_DRAFT'
  })
  status: string;

  @Prop({
    version: { type: String, default: '1.0.0' },
    compatibility: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    documentationUrl: String,
    demoUrl: String,
    githubUrl: String,
    customFields: { type: Map, of: String }
  })
  metadata: {
    version: string;
    compatibility: string[];
    requirements: string[];
    documentationUrl?: string;
    demoUrl?: string;
    githubUrl?: string;
    customFields: Map<string, string>;
  };

  @Prop({
    totalViews: { type: Number, default: 0 },
    totalDownloads: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    viewsLast30Days: { type: Number, default: 0 },
    downloadsLast30Days: { type: Number, default: 0 }
  })
  stats: {
    totalViews: number;
    totalDownloads: number;
    totalPurchases: number;
    averageRating: number;
    totalReviews: number;
    viewsLast30Days: number;
    downloadsLast30Days: number;
  };

  @Prop({ default: true })
  isFeatured: boolean;

  @Prop({ default: false })
  isPromoted: boolean;

  @Prop()
  promotedUntil: Date;

  @Prop({ type: Object, default: {} })
  seoData: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ vendorId: 1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ type: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ 'pricing.price': 1 });
ProductSchema.index({ 'stats.averageRating': -1 });
ProductSchema.index({ 'stats.totalViews': -1 });
ProductSchema.index({ 'stats.totalDownloads': -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ updatedAt: -1 });
ProductSchema.index({ slug: 1 }, { unique: true });

// Compound indexes
ProductSchema.index({ status: 1, type: 1, categoryId: 1 });
ProductSchema.index({ isFeatured: 1, status: 1, 'stats.averageRating': -1 });

// Transform output
ProductSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

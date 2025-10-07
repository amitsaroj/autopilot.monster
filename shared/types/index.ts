/**
 * Shared TypeScript Types and Interfaces
 */

// ============================================
// Common Response Types
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string;
  stack?: string;
}

// ============================================
// User Types
// ============================================

export enum UserRole {
  USER = 'user',
  VENDOR = 'vendor',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  DELETED = 'deleted',
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ============================================
// Product Types
// ============================================

export enum ProductType {
  AI_AGENT = 'ai_agent',
  N8N_WORKFLOW = 'n8n_workflow',
  AUTOMATION_TOOL = 'automation_tool',
  TEMPLATE = 'template',
  INTEGRATION = 'integration',
}

export enum ProductStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  type: ProductType;
  status: ProductStatus;
  vendorId: string;
  vendor?: any; // Populated vendor details
  price: number;
  currency: string;
  images: string[];
  thumbnail?: string;
  tags: string[];
  categories: string[];
  features: string[];
  requirements?: string[];
  downloads: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  trending: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Order Types
// ============================================

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  STRIPE = 'stripe',
  RAZORPAY = 'razorpay',
  PAYPAL = 'paypal',
}

export interface OrderItem {
  productId: string;
  product?: Product;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentIntentId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Cart Types
// ============================================

export interface CartItem {
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Cart {
  _id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  couponCode?: string;
  couponDiscount?: number;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Vendor Types
// ============================================

export enum VendorStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  REJECTED = 'rejected',
}

export enum KYCStatus {
  NOT_SUBMITTED = 'not_submitted',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface Vendor {
  _id: string;
  userId: string;
  user?: User;
  businessName: string;
  businessEmail: string;
  businessPhone?: string;
  description?: string;
  logo?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  status: VendorStatus;
  kycStatus: KYCStatus;
  kycDocuments?: string[];
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Content Types
// ============================================

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author: string;
  authorDetails?: User;
  status: ContentStatus;
  tags: string[];
  categories: string[];
  views: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tutorial {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: string;
  thumbnail?: string;
  videoUrl?: string;
  tags: string[];
  status: ContentStatus;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Review Types
// ============================================

export interface Review {
  _id: string;
  productId: string;
  product?: Product;
  userId: string;
  user?: User;
  rating: number;
  title?: string;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Notification Types
// ============================================

export enum NotificationType {
  ORDER_CONFIRMATION = 'order_confirmation',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  PRODUCT_APPROVED = 'product_approved',
  PRODUCT_REJECTED = 'product_rejected',
  VENDOR_APPROVED = 'vendor_approved',
  PAYOUT_COMPLETED = 'payout_completed',
  EMAIL_VERIFICATION = 'email_verification',
  PASSWORD_RESET = 'password_reset',
}

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

// ============================================
// Pagination Types
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  status?: string;
  type?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  trending?: boolean;
  [key: string]: any;
}

// ============================================
// JWT Payload
// ============================================

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// ============================================
// Request with User
// ============================================

export interface RequestWithUser {
  user?: JwtPayload;
  [key: string]: any;
}

// ============================================
// Health Check
// ============================================

export interface HealthStatus {
  status: 'ok' | 'error' | 'degraded';
  service: string;
  version: string;
  uptime: number;
  timestamp: string;
  dependencies?: {
    database?: {
      status: 'connected' | 'disconnected';
      responseTime?: number;
    };
    redis?: {
      status: 'connected' | 'disconnected';
      responseTime?: number;
    };
    kafka?: {
      status: 'connected' | 'disconnected';
      producerConnected?: boolean;
      activeConsumers?: number;
    };
  };
}


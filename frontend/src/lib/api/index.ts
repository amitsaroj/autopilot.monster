/**
 * API Index - Export all API modules
 */

export { authApi } from './auth.api';
export { marketplaceApi } from './marketplace.api';
export { cartApi } from './cart.api';
export { orderApi } from './order.api';
export { userApi } from './user.api';
export { vendorApi } from './vendor.api';
export { adminApi } from './admin.api';
export { contentApi } from './content.api';
export { checkoutApi } from './checkout.api';
export { systemApi } from './system.api';
export { apiClient } from './client';

// Re-export types
export type { RegisterData, LoginData, AuthResponse, UserProfile } from './auth.api';
export type { Product, Category, Review, SearchFilters } from './marketplace.api';
export type { Cart, CartItem } from './cart.api';
export type { Order, Payment } from './order.api';
export type { Wishlist, Subscription } from './user.api';
export type { VendorProfile, VendorProduct, VendorAnalytics, VendorEarnings } from './vendor.api';
export type { AdminDashboardStats, AdminUser, AdminVendor, AdminProduct } from './admin.api';
export type { BlogPost, HelpArticle, JobListing } from './content.api';
export type { CheckoutSession, PaymentMethod, ShippingAddress } from './checkout.api';
export type { SystemStatus, ServiceStatus, SystemHealth, SystemMetrics } from './system.api';

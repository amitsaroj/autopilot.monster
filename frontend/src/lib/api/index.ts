/**
 * API Index - Export all API modules
 */

export { authApi } from './auth.api';
export { marketplaceApi } from './marketplace.api';
export { cartApi } from './cart.api';
export { orderApi } from './order.api';
export { userApi } from './user.api';
export { apiClient } from './client';

// Re-export types
export type { RegisterData, LoginData, AuthResponse, UserProfile } from './auth.api';
export type { Product, Category, Review, SearchFilters } from './marketplace.api';
export type { Cart, CartItem } from './cart.api';
export type { Order, Payment } from './order.api';
export type { Wishlist, Subscription } from './user.api';

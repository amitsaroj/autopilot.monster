/**
 * Cart Service - Business Logic
 */

import { Cart, ICart, ICartItem } from '../models/cart.model';
import { publishMessage, KafkaTopic } from '../../../../shared/config/kafka';
import { cache } from '../../../../shared/config/redis';
import { logger } from '../../../../shared/config/logger';

export class CartService {
  /**
   * Get user cart
   */
  async getCart(userId: string): Promise<ICart | null> {
    try {
      // Check cache
      const cacheKey = `cart:${userId}`;
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      let cart = await Cart.findOne({ userId });
      
      // Create empty cart if doesn't exist
      if (!cart) {
        cart = await Cart.create({
          userId,
          items: [],
          subtotal: 0,
          discount: 0,
          tax: 0,
          total: 0,
        });
      }

      // Cache for 5 minutes
      await cache.set(cacheKey, JSON.stringify(cart), 300);

      return cart;
    } catch (error) {
      logger.error('Error getting cart:', error);
      throw new Error('Failed to get cart');
    }
  }

  /**
   * Add item to cart
   */
  async addItem(userId: string, item: Omit<ICartItem, 'subtotal'>): Promise<ICart | null> {
    try {
      const subtotal = item.price * item.quantity;
      const cartItem: ICartItem = { ...item, subtotal };

      // Check if item already exists in cart
      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = await Cart.create({
          userId,
          items: [cartItem],
          subtotal,
          discount: 0,
          tax: 0,
          total: subtotal,
        });
      } else {
        const existingItemIndex = cart.items.findIndex(
          (i) => i.productId === item.productId
        );

        if (existingItemIndex >= 0) {
          // Update quantity if item exists
          cart.items[existingItemIndex].quantity += item.quantity;
          cart.items[existingItemIndex].subtotal =
            cart.items[existingItemIndex].price * cart.items[existingItemIndex].quantity;
        } else {
          // Add new item
          cart.items.push(cartItem);
        }

        // Recalculate totals
        cart = await this.recalculateTotals(cart);
        await cart.save();
      }

      // Clear cache
      await cache.del(`cart:${userId}`);

      // Publish event
      await publishMessage(KafkaTopic.CART_UPDATED, {
        userId,
        action: 'added',
        productId: item.productId,
        quantity: item.quantity,
        timestamp: new Date().toISOString(),
      });

      return cart;
    } catch (error) {
      logger.error('Error adding item to cart:', error);
      throw new Error('Failed to add item to cart');
    }
  }

  /**
   * Update cart item quantity
   */
  async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<ICart | null> {
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return null;
      }

      const itemIndex = cart.items.findIndex((i) => i.productId === productId);
      if (itemIndex < 0) {
        throw new Error('Item not found in cart');
      }

      if (quantity <= 0) {
        // Remove item if quantity is 0
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].subtotal = cart.items[itemIndex].price * quantity;
      }

      // Recalculate totals
      const updatedCart = await this.recalculateTotals(cart);
      await updatedCart.save();

      // Clear cache
      await cache.del(`cart:${userId}`);

      // Publish event
      await publishMessage(KafkaTopic.CART_UPDATED, {
        userId,
        action: 'updated',
        productId,
        quantity,
        timestamp: new Date().toISOString(),
      });

      return updatedCart;
    } catch (error) {
      logger.error('Error updating cart item:', error);
      throw new Error('Failed to update cart item');
    }
  }

  /**
   * Remove item from cart
   */
  async removeItem(userId: string, productId: string): Promise<ICart | null> {
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return null;
      }

      cart.items = cart.items.filter((i) => i.productId !== productId);

      // Recalculate totals
      const updatedCart = await this.recalculateTotals(cart);
      await updatedCart.save();

      // Clear cache
      await cache.del(`cart:${userId}`);

      // Publish event
      await publishMessage(KafkaTopic.CART_UPDATED, {
        userId,
        action: 'removed',
        productId,
        timestamp: new Date().toISOString(),
      });

      return updatedCart;
    } catch (error) {
      logger.error('Error removing item from cart:', error);
      throw new Error('Failed to remove item from cart');
    }
  }

  /**
   * Clear cart
   */
  async clearCart(userId: string): Promise<boolean> {
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return false;
      }

      cart.items = [];
      cart.subtotal = 0;
      cart.discount = 0;
      cart.couponCode = undefined;
      cart.tax = 0;
      cart.total = 0;
      await cart.save();

      // Clear cache
      await cache.del(`cart:${userId}`);

      // Publish event
      await publishMessage(KafkaTopic.CART_CLEARED, {
        userId,
        timestamp: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      logger.error('Error clearing cart:', error);
      throw new Error('Failed to clear cart');
    }
  }

  /**
   * Apply coupon code
   */
  async applyCoupon(userId: string, couponCode: string): Promise<ICart | null> {
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return null;
      }

      // TODO: Validate coupon code with coupon service via Kafka or API
      // For now, apply a fixed 10% discount
      const discountPercent = 10;
      const discount = (cart.subtotal * discountPercent) / 100;

      cart.couponCode = couponCode;
      cart.discount = discount;
      cart.total = cart.subtotal - discount + cart.tax;

      await cart.save();

      // Clear cache
      await cache.del(`cart:${userId}`);

      // Publish event
      await publishMessage(KafkaTopic.CART_COUPON_APPLIED, {
        userId,
        couponCode,
        discount,
        timestamp: new Date().toISOString(),
      });

      return cart;
    } catch (error) {
      logger.error('Error applying coupon:', error);
      throw new Error('Failed to apply coupon');
    }
  }

  /**
   * Remove coupon
   */
  async removeCoupon(userId: string): Promise<ICart | null> {
    try {
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return null;
      }

      cart.couponCode = undefined;
      cart.discount = 0;
      cart.total = cart.subtotal + cart.tax;

      await cart.save();

      // Clear cache
      await cache.del(`cart:${userId}`);

      return cart;
    } catch (error) {
      logger.error('Error removing coupon:', error);
      throw new Error('Failed to remove coupon');
    }
  }

  /**
   * Recalculate cart totals
   */
  private async recalculateTotals(cart: ICart): Promise<ICart> {
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    
    // Calculate tax (10% of subtotal for example)
    cart.tax = cart.subtotal * 0.1;
    
    // Calculate total
    cart.total = cart.subtotal - cart.discount + cart.tax;

    return cart;
  }
}

export const cartService = new CartService();


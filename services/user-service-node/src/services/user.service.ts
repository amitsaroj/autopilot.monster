/**
 * User Service - Business Logic
 */

import { Profile, IProfile } from '../models/profile.model';
import { Wishlist, IWishlist } from '../models/wishlist.model';
import { Subscription, ISubscription } from '../models/subscription.model';
import { publishMessage, KafkaTopic } from '../../../../shared/config/kafka';
import { cache } from '../../../../shared/config/redis';
import { logger } from '../../../../shared/config/logger';

export class UserService {
  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<IProfile | null> {
    try {
      // Check cache
      const cacheKey = `profile:${userId}`;
      const cached = await cache.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // Get from database
      const profile = await Profile.findOne({ userId });
      if (!profile) {
        return null;
      }

      // Cache the result
      await cache.set(cacheKey, JSON.stringify(profile), 300);

      return profile;
    } catch (error) {
      logger.error('Error getting profile:', error);
      throw new Error('Failed to get profile');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<IProfile>): Promise<IProfile | null> {
    try {
      const profile = await Profile.findOneAndUpdate(
        { userId },
        { $set: { ...updates, lastActive: new Date() } },
        { new: true, upsert: false }
      );

      if (!profile) {
        return null;
      }

      // Clear cache
      await cache.del(`profile:${userId}`);

      // Publish event
      await publishMessage(KafkaTopic.USER_PROFILE_UPDATED, {
        userId,
        updates,
        timestamp: new Date().toISOString(),
      });

      return profile;
    } catch (error) {
      logger.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  /**
   * Create user profile (called when user registers)
   */
  async createProfile(data: Partial<IProfile>): Promise<IProfile> {
    try {
      const profile = await Profile.create(data);

      // Publish event
      await publishMessage(KafkaTopic.USER_PROFILE_CREATED, {
        userId: profile.userId,
        email: profile.email,
        timestamp: new Date().toISOString(),
      });

      return profile;
    } catch (error) {
      logger.error('Error creating profile:', error);
      throw new Error('Failed to create profile');
    }
  }

  /**
   * Get user wishlist
   */
  async getWishlist(userId: string): Promise<IWishlist | null> {
    try {
      let wishlist = await Wishlist.findOne({ userId });
      
      // Create empty wishlist if doesn't exist
      if (!wishlist) {
        wishlist = await Wishlist.create({ userId, items: [] });
      }

      return wishlist;
    } catch (error) {
      logger.error('Error getting wishlist:', error);
      throw new Error('Failed to get wishlist');
    }
  }

  /**
   * Add item to wishlist
   */
  async addToWishlist(
    userId: string,
    productId: string,
    productName: string,
    productPrice: number
  ): Promise<IWishlist | null> {
    try {
      const wishlist = await Wishlist.findOneAndUpdate(
        { userId },
        {
          $addToSet: {
            items: {
              productId,
              productName,
              productPrice,
              addedAt: new Date(),
            },
          },
        },
        { new: true, upsert: true }
      );

      // Publish event
      await publishMessage(KafkaTopic.USER_WISHLIST_UPDATED, {
        userId,
        action: 'added',
        productId,
        timestamp: new Date().toISOString(),
      });

      return wishlist;
    } catch (error) {
      logger.error('Error adding to wishlist:', error);
      throw new Error('Failed to add to wishlist');
    }
  }

  /**
   * Remove item from wishlist
   */
  async removeFromWishlist(userId: string, productId: string): Promise<IWishlist | null> {
    try {
      const wishlist = await Wishlist.findOneAndUpdate(
        { userId },
        { $pull: { items: { productId } } },
        { new: true }
      );

      // Publish event
      await publishMessage(KafkaTopic.USER_WISHLIST_UPDATED, {
        userId,
        action: 'removed',
        productId,
        timestamp: new Date().toISOString(),
      });

      return wishlist;
    } catch (error) {
      logger.error('Error removing from wishlist:', error);
      throw new Error('Failed to remove from wishlist');
    }
  }

  /**
   * Get user subscriptions
   */
  async getSubscriptions(userId: string): Promise<ISubscription[]> {
    try {
      const subscriptions = await Subscription.find({ userId }).sort({ createdAt: -1 });
      return subscriptions;
    } catch (error) {
      logger.error('Error getting subscriptions:', error);
      throw new Error('Failed to get subscriptions');
    }
  }

  /**
   * Get active subscription
   */
  async getActiveSubscription(userId: string): Promise<ISubscription | null> {
    try {
      const subscription = await Subscription.findOne({
        userId,
        status: 'active',
        endDate: { $gt: new Date() },
      });

      return subscription;
    } catch (error) {
      logger.error('Error getting active subscription:', error);
      throw new Error('Failed to get active subscription');
    }
  }

  /**
   * Create subscription
   */
  async createSubscription(data: Partial<ISubscription>): Promise<ISubscription> {
    try {
      const subscription = await Subscription.create(data);

      // Publish event
      await publishMessage(KafkaTopic.USER_SUBSCRIPTION_CREATED, {
        userId: subscription.userId,
        plan: subscription.plan,
        amount: subscription.amount,
        timestamp: new Date().toISOString(),
      });

      return subscription;
    } catch (error) {
      logger.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<ISubscription | null> {
    try {
      const subscription = await Subscription.findByIdAndUpdate(
        subscriptionId,
        { status: 'cancelled', autoRenew: false },
        { new: true }
      );

      if (subscription) {
        // Publish event
        await publishMessage(KafkaTopic.USER_SUBSCRIPTION_CANCELLED, {
          userId: subscription.userId,
          subscriptionId,
          timestamp: new Date().toISOString(),
        });
      }

      return subscription;
    } catch (error) {
      logger.error('Error cancelling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Get user dashboard stats
   */
  async getDashboardStats(userId: string): Promise<any> {
    try {
      const [profile, wishlist, activeSubscription] = await Promise.all([
        this.getProfile(userId),
        this.getWishlist(userId),
        this.getActiveSubscription(userId),
      ]);

      return {
        profile: {
          name: `${profile?.firstName} ${profile?.lastName}`,
          email: profile?.email,
          avatar: profile?.avatar,
        },
        wishlistCount: wishlist?.items.length || 0,
        subscription: activeSubscription
          ? {
              plan: activeSubscription.plan,
              status: activeSubscription.status,
              endDate: activeSubscription.endDate,
            }
          : null,
        lastActive: profile?.lastActive,
      };
    } catch (error) {
      logger.error('Error getting dashboard stats:', error);
      throw new Error('Failed to get dashboard stats');
    }
  }
}

export const userService = new UserService();


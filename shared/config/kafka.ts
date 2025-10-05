/**
 * Kafka Configuration and Manager
 * Centralized Kafka producer and consumer management
 */

import { Kafka, Producer, Consumer, EachMessagePayload, KafkaConfig, ProducerRecord, ConsumerSubscribeTopics, ConsumerRunConfig } from 'kafkajs';
import { logger } from './logger';
import { envConfig } from './env';

export interface KafkaMessage {
  topic: string;
  key?: string;
  value: any;
  headers?: Record<string, string>;
}

export interface MessageHandler {
  (payload: EachMessagePayload): Promise<void>;
}

class KafkaManager {
  private kafka: Kafka;
  private producer: Producer | null = null;
  private consumers: Map<string, Consumer> = new Map();
  private isProducerConnected: boolean = false;

  constructor() {
    const kafkaConfig: KafkaConfig = {
      clientId: envConfig.get('KAFKA_CLIENT_ID'),
      brokers: envConfig.get('KAFKA_BROKERS'),
      retry: {
        initialRetryTime: 100,
        retries: 8,
        maxRetryTime: 30000,
        multiplier: 2,
        factor: 0.2,
      },
      connectionTimeout: 10000,
      requestTimeout: 30000,
    };

    this.kafka = new Kafka(kafkaConfig);
    logger.info('[Kafka] Kafka client initialized');
  }

  /**
   * Get or create producer
   */
  private async getProducer(): Promise<Producer> {
    if (this.producer && this.isProducerConnected) {
      return this.producer;
    }

    try {
      this.producer = this.kafka.producer({
        allowAutoTopicCreation: true,
        transactionTimeout: 30000,
      });

      await this.producer.connect();
      this.isProducerConnected = true;

      this.producer.on('producer.connect', () => {
        logger.info('[Kafka] Producer connected');
      });

      this.producer.on('producer.disconnect', () => {
        logger.warn('[Kafka] Producer disconnected');
        this.isProducerConnected = false;
      });

      logger.info('[Kafka] Producer initialized and connected');
      return this.producer;
    } catch (error) {
      logger.error('[Kafka] Failed to initialize producer:', error);
      throw error;
    }
  }

  /**
   * Send a message to Kafka
   * @param message - Message to send
   */
  async sendMessage(message: KafkaMessage): Promise<void> {
    try {
      const producer = await this.getProducer();

      const record: ProducerRecord = {
        topic: message.topic,
        messages: [
          {
            key: message.key,
            value: JSON.stringify(message.value),
            headers: message.headers,
          },
        ],
      };

      await producer.send(record);
      logger.debug(`[Kafka] Message sent to topic: ${message.topic}`);
    } catch (error) {
      logger.error(`[Kafka] Failed to send message to topic ${message.topic}:`, error);
      throw error;
    }
  }

  /**
   * Send multiple messages to Kafka
   * @param messages - Array of messages to send
   */
  async sendMessages(messages: KafkaMessage[]): Promise<void> {
    try {
      const producer = await this.getProducer();

      const groupedMessages = messages.reduce((acc, msg) => {
        if (!acc[msg.topic]) {
          acc[msg.topic] = [];
        }
        acc[msg.topic].push({
          key: msg.key,
          value: JSON.stringify(msg.value),
          headers: msg.headers,
        });
        return acc;
      }, {} as Record<string, any[]>);

      const promises = Object.entries(groupedMessages).map(([topic, msgs]) =>
        producer.send({
          topic,
          messages: msgs,
        })
      );

      await Promise.all(promises);
      logger.debug(`[Kafka] Sent ${messages.length} messages to Kafka`);
    } catch (error) {
      logger.error('[Kafka] Failed to send batch messages:', error);
      throw error;
    }
  }

  /**
   * Create and subscribe a consumer
   * @param groupId - Consumer group ID
   * @param topics - Topics to subscribe to
   * @param handler - Message handler function
   */
  async subscribe(
    groupId: string,
    topics: string[],
    handler: MessageHandler
  ): Promise<Consumer> {
    try {
      // Check if consumer already exists
      if (this.consumers.has(groupId)) {
        logger.warn(`[Kafka] Consumer with groupId ${groupId} already exists`);
        return this.consumers.get(groupId)!;
      }

      const consumer = this.kafka.consumer({
        groupId,
        sessionTimeout: 30000,
        heartbeatInterval: 3000,
      });

      await consumer.connect();
      logger.info(`[Kafka] Consumer connected with groupId: ${groupId}`);

      const subscribeTopics: ConsumerSubscribeTopics = {
        topics,
        fromBeginning: false,
      };

      await consumer.subscribe(subscribeTopics);
      logger.info(`[Kafka] Consumer subscribed to topics: ${topics.join(', ')}`);

      const runConfig: ConsumerRunConfig = {
        eachMessage: async (payload: EachMessagePayload) => {
          try {
            logger.debug(
              `[Kafka] Processing message from topic: ${payload.topic}, partition: ${payload.partition}`
            );
            await handler(payload);
          } catch (error) {
            logger.error(
              `[Kafka] Error processing message from topic ${payload.topic}:`,
              error
            );
            // In production, you might want to implement a dead-letter queue here
          }
        },
      };

      await consumer.run(runConfig);

      // Event listeners
      consumer.on('consumer.connect', () => {
        logger.info(`[Kafka] Consumer ${groupId} connected`);
      });

      consumer.on('consumer.disconnect', () => {
        logger.warn(`[Kafka] Consumer ${groupId} disconnected`);
      });

      consumer.on('consumer.crash', (event) => {
        logger.error(`[Kafka] Consumer ${groupId} crashed:`, event.payload.error);
      });

      this.consumers.set(groupId, consumer);
      return consumer;
    } catch (error) {
      logger.error(`[Kafka] Failed to create consumer with groupId ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect a specific consumer
   * @param groupId - Consumer group ID
   */
  async disconnectConsumer(groupId: string): Promise<void> {
    try {
      const consumer = this.consumers.get(groupId);
      if (consumer) {
        await consumer.disconnect();
        this.consumers.delete(groupId);
        logger.info(`[Kafka] Consumer ${groupId} disconnected`);
      }
    } catch (error) {
      logger.error(`[Kafka] Error disconnecting consumer ${groupId}:`, error);
      throw error;
    }
  }

  /**
   * Disconnect producer
   */
  async disconnectProducer(): Promise<void> {
    try {
      if (this.producer && this.isProducerConnected) {
        await this.producer.disconnect();
        this.isProducerConnected = false;
        logger.info('[Kafka] Producer disconnected');
      }
    } catch (error) {
      logger.error('[Kafka] Error disconnecting producer:', error);
      throw error;
    }
  }

  /**
   * Disconnect all consumers and producer
   */
  async disconnectAll(): Promise<void> {
    try {
      // Disconnect all consumers
      const consumerPromises = Array.from(this.consumers.keys()).map((groupId) =>
        this.disconnectConsumer(groupId)
      );
      await Promise.all(consumerPromises);

      // Disconnect producer
      await this.disconnectProducer();

      logger.info('[Kafka] All Kafka connections closed');
    } catch (error) {
      logger.error('[Kafka] Error disconnecting all:', error);
      throw error;
    }
  }

  /**
   * Get health status
   */
  getHealthStatus(): {
    producerConnected: boolean;
    activeConsumers: number;
    consumerGroups: string[];
  } {
    return {
      producerConnected: this.isProducerConnected,
      activeConsumers: this.consumers.size,
      consumerGroups: Array.from(this.consumers.keys()),
    };
  }
}

// Export singleton instance
export const kafkaManager = new KafkaManager();

/**
 * Helper function to send a message
 * @param topic - Kafka topic
 * @param value - Message value
 * @param key - Optional message key
 * @param headers - Optional headers
 */
export async function publishMessage(
  topic: string,
  value: any,
  key?: string,
  headers?: Record<string, string>
): Promise<void> {
  return kafkaManager.sendMessage({ topic, value, key, headers });
}

/**
 * Helper function to subscribe to topics
 * @param groupId - Consumer group ID
 * @param topics - Topics to subscribe to
 * @param handler - Message handler function
 */
export async function subscribeToTopics(
  groupId: string,
  topics: string[],
  handler: MessageHandler
): Promise<Consumer> {
  return kafkaManager.subscribe(groupId, topics, handler);
}

/**
 * Kafka Topics Enum
 */
export enum KafkaTopic {
  // Auth events
  USER_REGISTERED = 'user.registered',
  USER_LOGGED_IN = 'user.logged-in',
  PASSWORD_RESET_REQUESTED = 'password.reset-requested',
  EMAIL_VERIFICATION_REQUESTED = 'email.verification-requested',
  
  // Order events
  ORDER_CREATED = 'order.created',
  ORDER_UPDATED = 'order.updated',
  ORDER_CANCELLED = 'order.cancelled',
  ORDER_COMPLETED = 'order.completed',
  
  // Payment events
  PAYMENT_INITIATED = 'payment.initiated',
  PAYMENT_SUCCESS = 'payment.success',
  PAYMENT_FAILED = 'payment.failed',
  REFUND_REQUESTED = 'refund.requested',
  REFUND_COMPLETED = 'refund.completed',
  
  // Product events
  PRODUCT_CREATED = 'product.created',
  PRODUCT_UPDATED = 'product.updated',
  PRODUCT_DELETED = 'product.deleted',
  PRODUCT_VIEWED = 'product.viewed',
  PRODUCT_DOWNLOADED = 'product.downloaded',
  
  // Vendor events
  VENDOR_REGISTERED = 'vendor.registered',
  VENDOR_APPROVED = 'vendor.approved',
  VENDOR_REJECTED = 'vendor.rejected',
  PAYOUT_REQUESTED = 'payout.requested',
  PAYOUT_COMPLETED = 'payout.completed',
  
  // Cart events
  CART_ITEM_ADDED = 'cart.item-added',
  CART_ITEM_REMOVED = 'cart.item-removed',
  CART_UPDATED = 'cart.updated',
  CART_CLEARED = 'cart.cleared',
  
  // Notification events
  EMAIL_SEND_REQUESTED = 'email.send-requested',
  NOTIFICATION_SEND_REQUESTED = 'notification.send-requested',
  
  // Analytics events
  ANALYTICS_EVENT = 'analytics.event',
  
  // Admin events
  ADMIN_ACTION = 'admin.action',
  CONTENT_APPROVED = 'content.approved',
  CONTENT_REJECTED = 'content.rejected',
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await kafkaManager.disconnectAll();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await kafkaManager.disconnectAll();
  process.exit(0);
});


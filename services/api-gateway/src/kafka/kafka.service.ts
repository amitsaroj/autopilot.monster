import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, KafkaMessage } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer> = new Map();

  constructor(private readonly configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: this.configService.get<string>('kafka.clientId'),
      brokers: this.configService.get<string[]>('kafka.brokers'),
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer({
      maxInFlightRequests: 1,
      idempotent: true,
      transactionTimeout: 30000,
    });
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      this.logger.log('Kafka producer connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect Kafka producer:', error);
    }
  }

  async onModuleDestroy() {
    try {
      // Disconnect all consumers
      for (const [groupId, consumer] of this.consumers) {
        await consumer.disconnect();
        this.logger.log(`Kafka consumer ${groupId} disconnected`);
      }

      // Disconnect producer
      await this.producer.disconnect();
      this.logger.log('Kafka producer disconnected');
    } catch (error) {
      this.logger.error('Error disconnecting Kafka:', error);
    }
  }

  async publishMessage(topic: string, message: any, key?: string) {
    try {
      const result = await this.producer.send({
        topic,
        messages: [
          {
            key: key || null,
            value: JSON.stringify(message),
            timestamp: Date.now().toString(),
            headers: {
              'source': 'api-gateway',
              'version': '1.0.0',
            },
          },
        ],
      });

      this.logger.debug(`Message published to topic ${topic}:`, result);
      return result;
    } catch (error) {
      this.logger.error(`Failed to publish message to topic ${topic}:`, error);
      throw error;
    }
  }

  async createConsumer(
    groupId: string,
    topic: string,
    messageHandler: (message: KafkaMessage) => Promise<void>,
  ) {
    try {
      const consumer = this.kafka.consumer({ groupId });
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: false });

      await consumer.run({
        eachMessage: async ({ topic: receivedTopic, partition, message }) => {
          try {
            this.logger.debug(
              `Received message from topic ${receivedTopic}, partition ${partition}:`,
              message.value?.toString(),
            );
            await messageHandler(message);
          } catch (error) {
            this.logger.error('Error processing message:', error);
          }
        },
      });

      this.consumers.set(groupId, consumer);
      this.logger.log(`Kafka consumer ${groupId} connected and subscribed to ${topic}`);

      return consumer;
    } catch (error) {
      this.logger.error(`Failed to create consumer ${groupId}:`, error);
      throw error;
    }
  }

  // Event publishing methods for different domains
  async publishUserEvent(eventType: string, userId: string, data: any) {
    return this.publishMessage('user-events', {
      eventType,
      userId,
      data,
      timestamp: new Date().toISOString(),
    }, userId);
  }

  async publishOrderEvent(eventType: string, orderId: string, data: any) {
    return this.publishMessage('order-events', {
      eventType,
      orderId,
      data,
      timestamp: new Date().toISOString(),
    }, orderId);
  }

  async publishProductEvent(eventType: string, productId: string, data: any) {
    return this.publishMessage('product-events', {
      eventType,
      productId,
      data,
      timestamp: new Date().toISOString(),
    }, productId);
  }

  async publishPaymentEvent(eventType: string, paymentId: string, data: any) {
    return this.publishMessage('payment-events', {
      eventType,
      paymentId,
      data,
      timestamp: new Date().toISOString(),
    }, paymentId);
  }

  async publishNotificationEvent(eventType: string, userId: string, data: any) {
    return this.publishMessage('notification-events', {
      eventType,
      userId,
      data,
      timestamp: new Date().toISOString(),
    }, userId);
  }

  async publishAnalyticsEvent(eventType: string, data: any) {
    return this.publishMessage('analytics-events', {
      eventType,
      data,
      timestamp: new Date().toISOString(),
    });
  }
}

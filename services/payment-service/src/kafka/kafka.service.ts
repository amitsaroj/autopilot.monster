import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, Consumer, EachMessagePayload } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;
  private consumer: Consumer;

  constructor(private configService: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'payment-service',
      brokers: this.configService.get('kafka.brokers', ['localhost:9092']),
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'payment-service-group' });
  }

  async onModuleInit() {
    try {
      await this.producer.connect();
      await this.consumer.connect();
      this.logger.log('Connected to Kafka');
    } catch (error) {
      this.logger.error('Failed to connect to Kafka:', error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.producer.disconnect();
      await this.consumer.disconnect();
      this.logger.log('Disconnected from Kafka');
    } catch (error) {
      this.logger.error('Failed to disconnect from Kafka:', error);
    }
  }

  async publishPaymentEvent(eventType: string, paymentId: string, data: any): Promise<void> {
    try {
      const message = {
        eventType,
        paymentId,
        data,
        timestamp: new Date().toISOString(),
        source: 'payment-service',
      };

      await this.producer.send({
        topic: 'payment.events',
        messages: [
          {
            key: paymentId,
            value: JSON.stringify(message),
            headers: {
              eventType,
              paymentId,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      });

      this.logger.log(`Published payment event: ${eventType} for payment ${paymentId}`);
    } catch (error) {
      this.logger.error(`Failed to publish payment event ${eventType}:`, error);
    }
  }

  async publishSubscriptionEvent(eventType: string, subscriptionId: string, data: any): Promise<void> {
    try {
      const message = {
        eventType,
        subscriptionId,
        data,
        timestamp: new Date().toISOString(),
        source: 'payment-service',
      };

      await this.producer.send({
        topic: 'subscription.events',
        messages: [
          {
            key: subscriptionId,
            value: JSON.stringify(message),
            headers: {
              eventType,
              subscriptionId,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      });

      this.logger.log(`Published subscription event: ${eventType} for subscription ${subscriptionId}`);
    } catch (error) {
      this.logger.error(`Failed to publish subscription event ${eventType}:`, error);
    }
  }

  async publishOrderEvent(eventType: string, orderId: string, data: any): Promise<void> {
    try {
      const message = {
        eventType,
        orderId,
        data,
        timestamp: new Date().toISOString(),
        source: 'payment-service',
      };

      await this.producer.send({
        topic: 'order.events',
        messages: [
          {
            key: orderId,
            value: JSON.stringify(message),
            headers: {
              eventType,
              orderId,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      });

      this.logger.log(`Published order event: ${eventType} for order ${orderId}`);
    } catch (error) {
      this.logger.error(`Failed to publish order event ${eventType}:`, error);
    }
  }

  async subscribeToTopic(topic: string, handler: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
    try {
      await this.consumer.subscribe({ topic, fromBeginning: false });
      
      await this.consumer.run({
        eachMessage: async (payload) => {
          try {
            await handler(payload);
          } catch (error) {
            this.logger.error(`Error processing message from topic ${topic}:`, error);
          }
        },
      });

      this.logger.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      this.logger.error(`Failed to subscribe to topic ${topic}:`, error);
    }
  }

  async subscribeToPaymentEvents(handler: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
    await this.subscribeToTopic('payment.events', handler);
  }

  async subscribeToSubscriptionEvents(handler: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
    await this.subscribeToTopic('subscription.events', handler);
  }

  async subscribeToOrderEvents(handler: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
    await this.subscribeToTopic('order.events', handler);
  }

  async createTopics(topics: string[]): Promise<void> {
    try {
      const admin = this.kafka.admin();
      await admin.connect();

      const existingTopics = await admin.listTopics();
      const topicsToCreate = topics.filter(topic => !existingTopics.includes(topic));

      if (topicsToCreate.length > 0) {
        await admin.createTopics({
          topics: topicsToCreate.map(topic => ({
            topic,
            numPartitions: 3,
            replicationFactor: 1,
          })),
        });
        this.logger.log(`Created topics: ${topicsToCreate.join(', ')}`);
      }

      await admin.disconnect();
    } catch (error) {
      this.logger.error('Failed to create topics:', error);
    }
  }
}

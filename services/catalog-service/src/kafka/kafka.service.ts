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
      clientId: 'catalog-service',
      brokers: this.configService.get('kafka.brokers', ['localhost:9092']),
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'catalog-service-group' });
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

  async publishProductEvent(eventType: string, productId: string, data: any): Promise<void> {
    try {
      const message = {
        eventType,
        productId,
        data,
        timestamp: new Date().toISOString(),
        source: 'catalog-service',
      };

      await this.producer.send({
        topic: 'product.events',
        messages: [
          {
            key: productId,
            value: JSON.stringify(message),
            headers: {
              eventType,
              productId,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      });

      this.logger.log(`Published product event: ${eventType} for product ${productId}`);
    } catch (error) {
      this.logger.error(`Failed to publish product event ${eventType}:`, error);
    }
  }

  async publishCategoryEvent(eventType: string, categoryId: string, data: any): Promise<void> {
    try {
      const message = {
        eventType,
        categoryId,
        data,
        timestamp: new Date().toISOString(),
        source: 'catalog-service',
      };

      await this.producer.send({
        topic: 'category.events',
        messages: [
          {
            key: categoryId,
            value: JSON.stringify(message),
            headers: {
              eventType,
              categoryId,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      });

      this.logger.log(`Published category event: ${eventType} for category ${categoryId}`);
    } catch (error) {
      this.logger.error(`Failed to publish category event ${eventType}:`, error);
    }
  }

  async publishAnalyticsEvent(eventType: string, data: any): Promise<void> {
    try {
      const message = {
        eventType,
        data,
        timestamp: new Date().toISOString(),
        source: 'catalog-service',
      };

      await this.producer.send({
        topic: 'analytics.events',
        messages: [
          {
            key: data.productId || data.categoryId || 'anonymous',
            value: JSON.stringify(message),
            headers: {
              eventType,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      });

      this.logger.log(`Published analytics event: ${eventType}`);
    } catch (error) {
      this.logger.error(`Failed to publish analytics event ${eventType}:`, error);
    }
  }

  async publishSearchEvent(eventType: string, data: any): Promise<void> {
    try {
      const message = {
        eventType,
        data,
        timestamp: new Date().toISOString(),
        source: 'catalog-service',
      };

      await this.producer.send({
        topic: 'search.events',
        messages: [
          {
            key: data.query || 'anonymous',
            value: JSON.stringify(message),
            headers: {
              eventType,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      });

      this.logger.log(`Published search event: ${eventType}`);
    } catch (error) {
      this.logger.error(`Failed to publish search event ${eventType}:`, error);
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

  async subscribeToProductEvents(handler: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
    await this.subscribeToTopic('product.events', handler);
  }

  async subscribeToCategoryEvents(handler: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
    await this.subscribeToTopic('category.events', handler);
  }

  async subscribeToAnalyticsEvents(handler: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
    await this.subscribeToTopic('analytics.events', handler);
  }

  async subscribeToSearchEvents(handler: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
    await this.subscribeToTopic('search.events', handler);
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

  async getTopicMetadata(topic: string): Promise<any> {
    try {
      const admin = this.kafka.admin();
      await admin.connect();
      
      const metadata = await admin.fetchTopicMetadata({ topics: [topic] });
      await admin.disconnect();
      
      return metadata;
    } catch (error) {
      this.logger.error(`Failed to get metadata for topic ${topic}:`, error);
      return null;
    }
  }

  async getConsumerGroupInfo(): Promise<any> {
    try {
      const admin = this.kafka.admin();
      await admin.connect();
      
      const groups = await admin.describeGroups(['catalog-service-group']);
      await admin.disconnect();
      
      return groups;
    } catch (error) {
      this.logger.error('Failed to get consumer group info:', error);
      return null;
    }
  }
}
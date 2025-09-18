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
      clientId: 'auth-service',
      brokers: this.configService.get('kafka.brokers', ['localhost:9092']),
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: 'auth-service-group' });
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

  async publishUserEvent(eventType: string, userId: string, data: any): Promise<void> {
    try {
      const message = {
        eventType,
        userId,
        data,
        timestamp: new Date().toISOString(),
        source: 'auth-service',
      };

      await this.producer.send({
        topic: 'user.events',
        messages: [
          {
            key: userId,
            value: JSON.stringify(message),
            headers: {
              eventType,
              userId,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      });

      this.logger.log(`Published user event: ${eventType} for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to publish user event ${eventType}:`, error);
    }
  }

  async publishAuthEvent(eventType: string, data: any): Promise<void> {
    try {
      const message = {
        eventType,
        data,
        timestamp: new Date().toISOString(),
        source: 'auth-service',
      };

      await this.producer.send({
        topic: 'auth.events',
        messages: [
          {
            key: data.userId || data.email || 'anonymous',
            value: JSON.stringify(message),
            headers: {
              eventType,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      });

      this.logger.log(`Published auth event: ${eventType}`);
    } catch (error) {
      this.logger.error(`Failed to publish auth event ${eventType}:`, error);
    }
  }

  async publishSecurityEvent(eventType: string, data: any): Promise<void> {
    try {
      const message = {
        eventType,
        data,
        timestamp: new Date().toISOString(),
        source: 'auth-service',
        severity: this.getEventSeverity(eventType),
      };

      await this.producer.send({
        topic: 'security.events',
        messages: [
          {
            key: data.userId || data.ip || 'anonymous',
            value: JSON.stringify(message),
            headers: {
              eventType,
              severity: message.severity,
              timestamp: new Date().toISOString(),
            },
          },
        ],
      });

      this.logger.log(`Published security event: ${eventType}`);
    } catch (error) {
      this.logger.error(`Failed to publish security event ${eventType}:`, error);
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

  async subscribeToUserEvents(handler: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
    await this.subscribeToTopic('user.events', handler);
  }

  async subscribeToAuthEvents(handler: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
    await this.subscribeToTopic('auth.events', handler);
  }

  async subscribeToSecurityEvents(handler: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
    await this.subscribeToTopic('security.events', handler);
  }

  private getEventSeverity(eventType: string): string {
    const severityMap = {
      'user.login': 'info',
      'user.logout': 'info',
      'user.registered': 'info',
      'user.password_changed': 'warning',
      'user.failed_login': 'warning',
      'user.account_locked': 'error',
      'user.suspicious_activity': 'error',
      'user.account_deleted': 'warning',
    };

    return severityMap[eventType] || 'info';
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
      
      const groups = await admin.describeGroups(['auth-service-group']);
      await admin.disconnect();
      
      return groups;
    } catch (error) {
      this.logger.error('Failed to get consumer group info:', error);
      return null;
    }
  }
}
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer, KafkaMessage } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private kafka: Kafka;
  private producer: Producer;

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
              'source': 'auth-service',
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

  async publishUserEvent(eventType: string, userId: string, data: any) {
    return this.publishMessage('user-events', {
      eventType,
      userId,
      data,
      timestamp: new Date().toISOString(),
    }, userId);
  }

  async publishAuthEvent(eventType: string, userId: string, data: any) {
    return this.publishMessage('auth-events', {
      eventType,
      userId,
      data,
      timestamp: new Date().toISOString(),
    }, userId);
  }
}

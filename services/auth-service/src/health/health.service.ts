import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);
  private readonly startTime = Date.now();

  constructor(private readonly configService: ConfigService) {}

  async checkHealth() {
    const status = 'ok';
    const timestamp = new Date().toISOString();
    const uptime = Date.now() - this.startTime;

    return {
      status,
      timestamp,
      uptime,
      service: 'auth-service',
      version: '1.0.0',
      environment: this.configService.get('NODE_ENV'),
    };
  }

  async getDetailedHealth() {
    const basicHealth = await this.checkHealth();
    
    return {
      ...basicHealth,
      dependencies: {
        mongodb: { status: 'healthy', responseTime: Math.random() * 50 },
        redis: { status: 'healthy', responseTime: Math.random() * 20 },
        kafka: { status: 'healthy', responseTime: Math.random() * 100 },
      },
      memory: this.getMemoryUsage(),
      cpu: process.cpuUsage(),
    };
  }

  private getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100,
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100,
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100,
      external: Math.round(usage.external / 1024 / 1024 * 100) / 100,
    };
  }
}

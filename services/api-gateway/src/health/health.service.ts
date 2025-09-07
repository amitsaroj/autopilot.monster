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
      service: 'api-gateway',
      version: '1.0.0',
      environment: this.configService.get('NODE_ENV'),
    };
  }

  async getDetailedHealth() {
    const basicHealth = await this.checkHealth();
    
    // Check external dependencies
    const dependencies = await this.checkDependencies();
    
    return {
      ...basicHealth,
      dependencies,
      memory: this.getMemoryUsage(),
      cpu: process.cpuUsage(),
    };
  }

  async checkReadiness() {
    try {
      // Check if all required services are available
      const dependencies = await this.checkDependencies();
      const isReady = Object.values(dependencies).every(
        (dep: any) => dep.status === 'healthy',
      );

      return {
        status: isReady ? 'ready' : 'not ready',
        timestamp: new Date().toISOString(),
        dependencies,
      };
    } catch (error) {
      this.logger.error('Readiness check failed:', error);
      return {
        status: 'not ready',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  async checkLiveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: Date.now() - this.startTime,
    };
  }

  private async checkDependencies() {
    const checks = {
      database: this.checkDatabase(),
      redis: this.checkRedis(),
      kafka: this.checkKafka(),
      authService: this.checkGrpcService('auth'),
      catalogService: this.checkGrpcService('catalog'),
      paymentService: this.checkGrpcService('payment'),
    };

    const results = {};
    for (const [name, check] of Object.entries(checks)) {
      try {
        results[name] = await check;
      } catch (error) {
        results[name] = {
          status: 'unhealthy',
          error: error.message,
          timestamp: new Date().toISOString(),
        };
      }
    }

    return results;
  }

  private async checkDatabase() {
    // This would check MongoDB connection
    // For now, return a mock healthy status
    return {
      status: 'healthy',
      responseTime: Math.random() * 50,
      timestamp: new Date().toISOString(),
    };
  }

  private async checkRedis() {
    // This would check Redis connection
    // For now, return a mock healthy status
    return {
      status: 'healthy',
      responseTime: Math.random() * 20,
      timestamp: new Date().toISOString(),
    };
  }

  private async checkKafka() {
    // This would check Kafka connection
    // For now, return a mock healthy status
    return {
      status: 'healthy',
      responseTime: Math.random() * 100,
      timestamp: new Date().toISOString(),
    };
  }

  private async checkGrpcService(serviceName: string) {
    // This would make a health check gRPC call to the service
    // For now, return a mock healthy status
    return {
      status: 'healthy',
      responseTime: Math.random() * 75,
      timestamp: new Date().toISOString(),
      service: serviceName,
    };
  }

  private getMemoryUsage() {
    const usage = process.memoryUsage();
    return {
      rss: Math.round(usage.rss / 1024 / 1024 * 100) / 100, // MB
      heapTotal: Math.round(usage.heapTotal / 1024 / 1024 * 100) / 100, // MB
      heapUsed: Math.round(usage.heapUsed / 1024 / 1024 * 100) / 100, // MB
      external: Math.round(usage.external / 1024 / 1024 * 100) / 100, // MB
    };
  }
}

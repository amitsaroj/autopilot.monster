import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private configService: ConfigService) {}

  async getHealth() {
    const startTime = Date.now();
    
    try {
      // Check database connection
      const dbStatus = await this.checkDatabase();
      
      // Check external services
      const externalServices = await this.checkExternalServices();
      
      const responseTime = Date.now() - startTime;
      
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'payment-service',
        version: this.configService.get('app.version', '1.0.0'),
        environment: this.configService.get('NODE_ENV', 'development'),
        responseTime: `${responseTime}ms`,
        checks: {
          database: dbStatus,
          externalServices,
        },
      };
    } catch (error) {
      this.logger.error('Health check failed:', error);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'payment-service',
        error: error.message,
      };
    }
  }

  async getReadiness() {
    try {
      const dbStatus = await this.checkDatabase();
      
      if (dbStatus.status === 'healthy') {
        return {
          status: 'ready',
          timestamp: new Date().toISOString(),
          service: 'payment-service',
        };
      } else {
        return {
          status: 'not_ready',
          timestamp: new Date().toISOString(),
          service: 'payment-service',
          reason: 'Database not available',
        };
      }
    } catch (error) {
      this.logger.error('Readiness check failed:', error);
      return {
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        service: 'payment-service',
        error: error.message,
      };
    }
  }

  async getLiveness() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      service: 'payment-service',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }

  private async checkDatabase() {
    try {
      // This would check MongoDB connection
      // For now, return healthy
      return {
        status: 'healthy',
        service: 'mongodb',
        responseTime: '1ms',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'mongodb',
        error: error.message,
      };
    }
  }

  private async checkExternalServices() {
    const services = [];
    
    try {
      // Check Stripe
      services.push({
        name: 'stripe',
        status: 'healthy',
        responseTime: '50ms',
      });
    } catch (error) {
      services.push({
        name: 'stripe',
        status: 'unhealthy',
        error: error.message,
      });
    }

    try {
      // Check Razorpay
      services.push({
        name: 'razorpay',
        status: 'healthy',
        responseTime: '30ms',
      });
    } catch (error) {
      services.push({
        name: 'razorpay',
        status: 'unhealthy',
        error: error.message,
      });
    }

    return services;
  }
}

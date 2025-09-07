import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'catalog-service',
      version: '1.0.0',
    };
  }
}

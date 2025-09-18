import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'user-service',
      version: '1.0.0',
      uptime: process.uptime(),
    };
  }

  async ready() {
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
      service: 'user-service',
    };
  }

  async live() {
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      service: 'user-service',
    };
  }
}

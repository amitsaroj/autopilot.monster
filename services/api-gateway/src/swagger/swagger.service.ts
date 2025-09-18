import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class SwaggerService {
  private readonly logger = new Logger(SwaggerService.name);

  constructor(private configService: ConfigService) {}

  async getUnifiedSwaggerSpec(): Promise<any> {
    const services = [
      { name: 'API Gateway', url: 'http://localhost:3001/api-docs-json' },
      { name: 'Auth Service', url: 'http://localhost:3002/api-docs-json' },
      { name: 'Catalog Service', url: 'http://localhost:3003/api-docs-json' },
      { name: 'Payment Service', url: 'http://localhost:3004/api-docs-json' },
      { name: 'User Service', url: 'http://localhost:3007/api-docs-json' },
      { name: 'Vendor Service', url: 'http://localhost:3008/api-docs-json' },
    ];

    const unifiedSpec = {
      openapi: '3.0.0',
      info: {
        title: 'Autopilot.Monster API',
        description: 'Comprehensive API documentation for Autopilot.Monster - AI Automation Platform',
        version: '1.0.0',
        contact: {
          name: 'Autopilot.Monster Team',
          email: 'support@autopilot.monster',
          url: 'https://autopilot.monster',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: 'https://api.autopilot.monster',
          description: 'Production server',
        },
        {
          url: 'http://localhost:3001',
          description: 'Development server',
        },
      ],
      tags: [
        {
          name: 'Authentication',
          description: 'User authentication and authorization endpoints',
        },
        {
          name: 'Users',
          description: 'User management and profile operations',
        },
        {
          name: 'Vendors',
          description: 'Vendor management and operations',
        },
        {
          name: 'Products',
          description: 'Product catalog and management',
        },
        {
          name: 'Orders',
          description: 'Order management and tracking',
        },
        {
          name: 'Payments',
          description: 'Payment processing and billing',
        },
        {
          name: 'Analytics',
          description: 'Analytics and reporting endpoints',
        },
        {
          name: 'Admin',
          description: 'Administrative operations',
        },
        {
          name: 'Health',
          description: 'Health check endpoints',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT token obtained from authentication endpoints',
          },
          apiKey: {
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key',
            description: 'API key for service-to-service communication',
          },
        },
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              email: { type: 'string', format: 'email' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              role: { type: 'string', enum: ['user', 'vendor', 'admin'] },
              isActive: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          Vendor: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              email: { type: 'string', format: 'email' },
              businessName: { type: 'string' },
              businessType: { type: 'string' },
              status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'suspended'] },
              isVerified: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          Product: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'number', format: 'float' },
              category: { type: 'string' },
              vendorId: { type: 'string', format: 'uuid' },
              isActive: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          Order: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              orderNumber: { type: 'string' },
              userId: { type: 'string', format: 'uuid' },
              status: { type: 'string', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
              totalAmount: { type: 'number', format: 'float' },
              currency: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          Payment: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              orderId: { type: 'string', format: 'uuid' },
              amount: { type: 'number', format: 'float' },
              currency: { type: 'string' },
              status: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'] },
              method: { type: 'string' },
              transactionId: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
          Error: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: false },
              message: { type: 'string' },
              error: { type: 'string' },
              statusCode: { type: 'integer' },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
          Success: {
            type: 'object',
            properties: {
              success: { type: 'boolean', example: true },
              data: { type: 'object' },
              message: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
        responses: {
          UnauthorizedError: {
            description: 'Authentication information is missing or invalid',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  success: false,
                  message: 'Unauthorized',
                  error: 'Unauthorized',
                  statusCode: 401,
                  timestamp: '2024-01-01T00:00:00.000Z',
                },
              },
            },
          },
          ForbiddenError: {
            description: 'Access denied',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  success: false,
                  message: 'Forbidden',
                  error: 'Forbidden',
                  statusCode: 403,
                  timestamp: '2024-01-01T00:00:00.000Z',
                },
              },
            },
          },
          NotFoundError: {
            description: 'Resource not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  success: false,
                  message: 'Not Found',
                  error: 'Not Found',
                  statusCode: 404,
                  timestamp: '2024-01-01T00:00:00.000Z',
                },
              },
            },
          },
          ValidationError: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
                example: {
                  success: false,
                  message: 'Validation failed',
                  error: 'Bad Request',
                  statusCode: 400,
                  timestamp: '2024-01-01T00:00:00.000Z',
                },
              },
            },
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
      paths: {},
    };

    // Try to fetch specs from each service
    for (const service of services) {
      try {
        const response = await axios.get(service.url, { timeout: 5000 });
        if (response.data && response.data.paths) {
          // Merge paths from each service
          Object.assign(unifiedSpec.paths, response.data.paths);
          this.logger.log(`Successfully merged ${service.name} API spec`);
        }
      } catch (error) {
        this.logger.warn(`Failed to fetch spec from ${service.name}: ${error.message}`);
      }
    }

    return unifiedSpec;
  }

  async getServiceHealth(): Promise<any> {
    const services = [
      { name: 'API Gateway', url: 'http://localhost:3001/health' },
      { name: 'Auth Service', url: 'http://localhost:3002/health' },
      { name: 'Catalog Service', url: 'http://localhost:3003/health' },
      { name: 'Payment Service', url: 'http://localhost:3004/health' },
      { name: 'User Service', url: 'http://localhost:3007/health' },
      { name: 'Vendor Service', url: 'http://localhost:3008/health' },
    ];

    const healthStatus = {};

    for (const service of services) {
      try {
        const response = await axios.get(service.url, { timeout: 3000 });
        healthStatus[service.name] = {
          status: 'healthy',
          response: response.data,
          lastChecked: new Date().toISOString(),
        };
      } catch (error) {
        healthStatus[service.name] = {
          status: 'unhealthy',
          error: error.message,
          lastChecked: new Date().toISOString(),
        };
      }
    }

    return healthStatus;
  }
}

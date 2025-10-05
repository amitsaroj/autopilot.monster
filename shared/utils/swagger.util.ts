/**
 * Swagger Utilities
 * Helper functions for generating and merging Swagger documentation
 */

import swaggerJsdoc from 'swagger-jsdoc';
import { envConfig } from '../config/env';

export interface SwaggerDefinition {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
    contact?: {
      name?: string;
      email?: string;
      url?: string;
    };
    license?: {
      name: string;
      url: string;
    };
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  components?: {
    securitySchemes?: any;
    schemas?: any;
  };
  security?: Array<any>;
  tags?: Array<{
    name: string;
    description: string;
  }>;
}

/**
 * Generate Swagger specification for a service
 * @param serviceName - Name of the service
 * @param port - Service port
 * @param apiPaths - Paths to API files
 * @param tags - Swagger tags
 */
export function generateSwaggerSpec(
  serviceName: string,
  port: number,
  apiPaths: string[],
  tags?: Array<{ name: string; description: string }>
) {
  const definition: SwaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: `${serviceName} API`,
      version: '1.0.0',
      description: `${serviceName} microservice API documentation`,
      contact: {
        name: 'Autopilot Monster Team',
        email: 'support@autopilot.monster',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: getCommonSchemas(),
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: tags || [],
  };

  const options = {
    definition,
    apis: apiPaths,
  };

  return swaggerJsdoc(options);
}

/**
 * Common schemas for all services
 */
function getCommonSchemas() {
  return {
    ApiResponse: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          description: 'Request success status',
        },
        data: {
          type: 'object',
          description: 'Response data',
        },
        message: {
          type: 'string',
          description: 'Response message',
        },
        statusCode: {
          type: 'number',
          description: 'HTTP status code',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          description: 'Response timestamp',
        },
      },
    },
    PaginatedResponse: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' },
          },
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
    ErrorResponse: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false,
        },
        error: {
          type: 'string',
          description: 'Error type',
        },
        message: {
          type: 'string',
          description: 'Error message',
        },
        statusCode: {
          type: 'number',
          description: 'HTTP status code',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
  };
}

/**
 * Merge multiple Swagger specifications
 * @param specs - Array of Swagger specs to merge
 */
export function mergeSwaggerSpecs(specs: any[]): any {
  const baseSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Autopilot Monster API',
      version: '1.0.0',
      description: 'Unified API documentation for all Autopilot Monster microservices',
      contact: {
        name: 'Autopilot Monster Team',
        email: 'support@autopilot.monster',
      },
    },
    servers: [
      {
        url: `http://localhost:${envConfig.get('API_GATEWAY_PORT')}`,
        description: 'API Gateway',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {},
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {},
    tags: [],
  };

  // Merge all specs
  specs.forEach((spec) => {
    // Merge paths
    if (spec.paths) {
      baseSpec.paths = {
        ...baseSpec.paths,
        ...spec.paths,
      };
    }

    // Merge schemas
    if (spec.components?.schemas) {
      baseSpec.components.schemas = {
        ...baseSpec.components.schemas,
        ...spec.components.schemas,
      };
    }

    // Merge tags
    if (spec.tags) {
      spec.tags.forEach((tag: any) => {
        if (!baseSpec.tags.find((t: any) => t.name === tag.name)) {
          baseSpec.tags.push(tag);
        }
      });
    }
  });

  return baseSpec;
}

/**
 * Fetch Swagger spec from a service
 * @param serviceUrl - Service URL
 */
export async function fetchServiceSwagger(serviceUrl: string): Promise<any> {
  try {
    const response = await fetch(`${serviceUrl}/api-docs-json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch Swagger from ${serviceUrl}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Swagger from ${serviceUrl}:`, error);
    return null;
  }
}


import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SwaggerService } from './swagger.service';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('swagger')
@Controller('api-docs')
export class SwaggerController {
  constructor(private readonly swaggerService: SwaggerService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get unified Swagger UI' })
  @ApiResponse({ status: 200, description: 'Swagger UI HTML' })
  async getSwaggerUI(@Res() res: Response) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Autopilot.Monster API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin:0;
      background: #fafafa;
    }
    .swagger-ui .topbar {
      background-color: #1a1a1a;
    }
    .swagger-ui .topbar .download-url-wrapper {
      display: none;
    }
    .swagger-ui .info .title {
      color: #3b82f6;
    }
    .swagger-ui .scheme-container {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: '/api-docs-json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        validatorUrl: null,
        tryItOutEnabled: true,
        requestInterceptor: function(request) {
          // Add authentication header if token exists
          const token = localStorage.getItem('auth_token');
          if (token) {
            request.headers.Authorization = 'Bearer ' + token;
          }
          return request;
        },
        onComplete: function() {
          // Add custom styling and functionality
          const style = document.createElement('style');
          style.textContent = \`
            .swagger-ui .info .title {
              font-size: 2.5rem;
              font-weight: 700;
              color: #1e40af;
            }
            .swagger-ui .info .description {
              font-size: 1.1rem;
              color: #6b7280;
            }
            .swagger-ui .scheme-container {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .swagger-ui .btn.authorize {
              background-color: #3b82f6;
              border-color: #3b82f6;
            }
            .swagger-ui .btn.authorize:hover {
              background-color: #2563eb;
              border-color: #2563eb;
            }
          \`;
          document.head.appendChild(style);
        }
      });
    };
  </script>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get('json')
  @Public()
  @ApiOperation({ summary: 'Get unified Swagger JSON spec' })
  @ApiResponse({ status: 200, description: 'Swagger JSON specification' })
  async getSwaggerJson() {
    return this.swaggerService.getUnifiedSwaggerSpec();
  }

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Get service health status' })
  @ApiResponse({ status: 200, description: 'Service health status' })
  async getServiceHealth() {
    return this.swaggerService.getServiceHealth();
  }
}

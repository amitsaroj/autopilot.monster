# Backend Services - NestJS Microservices Architecture

## 🏗️ Microservices Overview

The Autopilot.monster backend is built using NestJS microservices architecture, providing scalable, maintainable, and production-ready services. Each service is independently deployable and follows domain-driven design principles.

## 🔧 Core Technologies

- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Message Queue**: NATS for inter-service communication
- **Cache**: Redis for session storage and caching
- **Validation**: Class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest with supertest
- **Monitoring**: OpenTelemetry integration

## 🏢 Service Catalog

### 1. API Gateway Service
**Port**: 3001
**Purpose**: Single entry point for all client requests

#### Key Features
- Request routing and load balancing
- Authentication middleware
- Rate limiting and throttling
- Request/response transformation
- Circuit breaker pattern

#### Core Structure
```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Autopilot.monster API')
    .setDescription('AI Agents & Automation Marketplace API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  await app.listen(3001);
}
bootstrap();
```

#### Authentication Guard
```typescript
// src/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
```

### 2. Authentication Service
**Port**: 3002
**Purpose**: User authentication and authorization

#### Database Schema
```typescript
// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({
    type: {
      firstName: String,
      lastName: String,
      avatar: String,
      bio: String,
    },
  })
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
  };

  @Prop([{
    name: { type: String, enum: ['customer', 'vendor', 'admin'] },
    permissions: [String],
    grantedAt: Date,
    grantedBy: String,
  }])
  roles: Array<{
    name: 'customer' | 'vendor' | 'admin';
    permissions: string[];
    grantedAt: Date;
    grantedBy: string;
  }>;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  lastLoginAt: Date;

  @Prop()
  refreshTokens: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
```

#### Authentication Controller
```typescript
// src/controllers/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto, RegisterDto, RefreshTokenDto } from '../dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
```

### 3. Catalog Service
**Port**: 3003
**Purpose**: Product catalog management

#### Product Schema
```typescript
// src/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  vendorId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({
    type: String,
    enum: ['ai-agent', 'n8n-workflow', 'automation-asset'],
    required: true,
  })
  type: 'ai-agent' | 'n8n-workflow' | 'automation-asset';

  @Prop([String])
  categories: string[];

  @Prop([String])
  tags: string[];

  @Prop({
    type: {
      type: { type: String, enum: ['free', 'one-time', 'subscription'] },
      amount: Number,
      currency: { type: String, default: 'USD' },
      subscriptionInterval: {
        type: String,
        enum: ['monthly', 'yearly'],
      },
    },
    required: true,
  })
  pricing: {
    type: 'free' | 'one-time' | 'subscription';
    amount?: number;
    currency: string;
    subscriptionInterval?: 'monthly' | 'yearly';
  };

  @Prop({
    type: {
      thumbnail: String,
      screenshots: [String],
      demoVideo: String,
    },
  })
  media: {
    thumbnail: string;
    screenshots: string[];
    demoVideo?: string;
  };

  @Prop({
    type: String,
    enum: ['draft', 'pending', 'approved', 'rejected', 'suspended'],
    default: 'draft',
  })
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended';

  @Prop({
    type: {
      downloads: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
    },
  })
  stats: {
    downloads: number;
    rating: number;
    reviewCount: number;
  };
}

export const ProductSchema = SchemaFactory.createForClass(Product);
```

#### Catalog Service Implementation
```typescript
// src/services/catalog.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../schemas/product.schema';
import { CreateProductDto, UpdateProductDto, SearchProductsDto } from '../dto';

@Injectable()
export class CatalogService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  async findAll(searchDto: SearchProductsDto): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 20,
      category,
      type,
      priceMin,
      priceMax,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = searchDto;

    const query: any = { status: 'approved' };

    // Build search query
    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.categories = { $in: [category] };
    }

    if (type) {
      query.type = type;
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      query['pricing.amount'] = {};
      if (priceMin !== undefined) query['pricing.amount'].$gte = priceMin;
      if (priceMax !== undefined) query['pricing.amount'].$lte = priceMax;
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [products, total] = await Promise.all([
      this.productModel
        .find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('vendorId', 'profile.firstName profile.lastName')
        .exec(),
      this.productModel.countDocuments(query),
    ]);

    return {
      products,
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('vendorId', 'profile.firstName profile.lastName')
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async incrementDownloads(id: string): Promise<void> {
    await this.productModel.findByIdAndUpdate(
      id,
      { $inc: { 'stats.downloads': 1 } },
    );
  }
}
```

### 4. Assets Service
**Port**: 3004
**Purpose**: File storage and asset management

#### Asset Schema
```typescript
// src/schemas/asset.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Asset extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  originalName: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  size: number;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  version: string;

  @Prop({
    type: {
      status: { type: String, enum: ['pending', 'clean', 'infected'] },
      scannedAt: Date,
      engine: String,
    },
  })
  scanResult: {
    status: 'pending' | 'clean' | 'infected';
    scannedAt: Date;
    engine: string;
  };

  @Prop({ default: false })
  isPreview: boolean;

  @Prop()
  metadata: Record<string, any>;
}

export const AssetSchema = SchemaFactory.createForClass(Asset);
```

#### File Upload Service
```typescript
// src/services/asset.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Asset } from '../schemas/asset.schema';
import { VirusScanService } from './virus-scan.service';

@Injectable()
export class AssetService {
  private s3: S3;

  constructor(
    @InjectModel(Asset.name) private assetModel: Model<Asset>,
    private virusScanService: VirusScanService,
  ) {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadAsset(
    file: Express.Multer.File,
    productId: string,
    isPreview = false,
  ): Promise<Asset> {
    // Validate file
    this.validateFile(file);

    // Generate unique filename
    const fileName = `${uuidv4()}-${file.originalname}`;
    const path = `assets/${productId}/${fileName}`;

    try {
      // Upload to S3
      await this.s3.upload({
        Bucket: process.env.S3_BUCKET,
        Key: path,
        Body: file.buffer,
        ContentType: file.mimetype,
      }).promise();

      // Create asset record
      const asset = new this.assetModel({
        productId,
        fileName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path,
        version: '1.0.0',
        isPreview,
        scanResult: {
          status: 'pending',
          scannedAt: new Date(),
          engine: 'ClamAV',
        },
      });

      const savedAsset = await asset.save();

      // Trigger virus scan
      this.virusScanService.scanAsset(savedAsset._id.toString());

      return savedAsset;
    } catch (error) {
      throw new BadRequestException('Failed to upload asset');
    }
  }

  async generatePresignedUrl(assetId: string, expiresIn = 3600): Promise<string> {
    const asset = await this.assetModel.findById(assetId);
    
    if (!asset) {
      throw new BadRequestException('Asset not found');
    }

    if (asset.scanResult.status !== 'clean') {
      throw new BadRequestException('Asset not available for download');
    }

    return this.s3.getSignedUrl('getObject', {
      Bucket: process.env.S3_BUCKET,
      Key: asset.path,
      Expires: expiresIn,
    });
  }

  private validateFile(file: Express.Multer.File): void {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      'application/json',
      'application/zip',
      'text/plain',
      'application/pdf',
    ];

    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 100MB limit');
    }

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('File type not supported');
    }
  }
}
```

### 5. Payments Service
**Port**: 3005
**Purpose**: Payment processing and subscription management

#### Payment Intent Schema
```typescript
// src/schemas/payment-intent.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class PaymentIntent extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'canceled'],
    default: 'pending',
  })
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';

  @Prop()
  stripePaymentIntentId: string;

  @Prop()
  paymentMethodId: string;

  @Prop({ type: Object })
  metadata: Record<string, any>;

  @Prop()
  completedAt: Date;
}

export const PaymentIntentSchema = SchemaFactory.createForClass(PaymentIntent);
```

### 6. Licensing Service
**Port**: 3006
**Purpose**: Digital rights management

#### License Schema
```typescript
// src/schemas/license.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class License extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'PaymentIntent' })
  paymentIntentId: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['perpetual', 'subscription', 'trial'],
    required: true,
  })
  type: 'perpetual' | 'subscription' | 'trial';

  @Prop({
    type: String,
    enum: ['active', 'expired', 'suspended', 'revoked'],
    default: 'active',
  })
  status: 'active' | 'expired' | 'suspended' | 'revoked';

  @Prop({
    type: {
      download: { type: Boolean, default: true },
      commercialUse: { type: Boolean, default: false },
      redistribution: { type: Boolean, default: false },
      modification: { type: Boolean, default: false },
    },
  })
  permissions: {
    download: boolean;
    commercialUse: boolean;
    redistribution: boolean;
    modification: boolean;
  };

  @Prop({
    type: {
      maxDownloads: Number,
      maxDevices: Number,
      expirationDate: Date,
    },
  })
  limits: {
    maxDownloads?: number;
    maxDevices?: number;
    expirationDate?: Date;
  };

  @Prop({ required: true })
  issuedAt: Date;

  @Prop()
  expiresAt: Date;
}

export const LicenseSchema = SchemaFactory.createForClass(License);
```

## 🔄 Inter-Service Communication

### NATS Event System
```typescript
// src/events/event.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, NatsConnection, JSONCodec } from 'nats';

@Injectable()
export class EventService implements OnModuleInit {
  private nc: NatsConnection;
  private jc = JSONCodec();

  async onModuleInit() {
    this.nc = await connect({
      servers: process.env.NATS_URL || 'nats://localhost:4222',
    });
  }

  async publish(subject: string, data: any): Promise<void> {
    await this.nc.publish(subject, this.jc.encode(data));
  }

  async subscribe(subject: string, handler: (data: any) => void): Promise<void> {
    const sub = this.nc.subscribe(subject);
    
    (async () => {
      for await (const msg of sub) {
        try {
          const data = this.jc.decode(msg.data);
          await handler(data);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    })();
  }
}
```

### Event Handlers
```typescript
// src/events/handlers/payment-completed.handler.ts
import { Injectable } from '@nestjs/common';
import { EventHandler } from '../decorators/event-handler.decorator';
import { LicenseService } from '../services/license.service';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class PaymentCompletedHandler {
  constructor(
    private licenseService: LicenseService,
    private notificationService: NotificationService,
  ) {}

  @EventHandler('payment.completed')
  async handle(event: {
    userId: string;
    productId: string;
    paymentIntentId: string;
    amount: number;
  }): Promise<void> {
    // Issue license
    await this.licenseService.issueLicense({
      userId: event.userId,
      productId: event.productId,
      paymentIntentId: event.paymentIntentId,
      type: 'perpetual',
    });

    // Send confirmation notification
    await this.notificationService.sendPaymentConfirmation(
      event.userId,
      event.productId,
    );
  }
}
```

## 🧪 Testing Strategy

### Unit Testing
```typescript
// src/services/__tests__/catalog.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CatalogService } from '../catalog.service';
import { Product } from '../../schemas/product.schema';

describe('CatalogService', () => {
  let service: CatalogService;
  let mockProductModel: any;

  beforeEach(async () => {
    mockProductModel = {
      new: jest.fn().mockResolvedValue({}),
      constructor: jest.fn().mockResolvedValue({}),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      save: jest.fn(),
      exec: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find products with search parameters', async () => {
    const mockProducts = [{ title: 'Test Product' }];
    mockProductModel.find.mockReturnValue({
      sort: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue(mockProducts),
            }),
          }),
        }),
      }),
    });

    mockProductModel.countDocuments.mockResolvedValue(1);

    const result = await service.findAll({
      page: 1,
      limit: 10,
      search: 'test',
    });

    expect(result.products).toEqual(mockProducts);
    expect(result.total).toBe(1);
  });
});
```

### Integration Testing
```typescript
// src/__tests__/catalog.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('Catalog (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/catalog/products (GET)', () => {
    return request(app.getHttpServer())
      .get('/catalog/products')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('products');
        expect(res.body).toHaveProperty('total');
      });
  });

  it('/catalog/products/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/catalog/products/507f1f77bcf86cd799439011')
      .expect(404);
  });
});
```

## 🚀 Deployment Configuration

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

### Kubernetes Deployment
```yaml
# k8s/catalog-service.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: catalog-service
  labels:
    app: catalog-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: catalog-service
  template:
    metadata:
      labels:
        app: catalog-service
    spec:
      containers:
      - name: catalog-service
        image: autopilot/catalog-service:latest
        ports:
        - containerPort: 3003
        env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: mongodb-uri
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: cache-secrets
              key: redis-url
        - name: NATS_URL
          value: "nats://nats-service:4222"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3003
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3003
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: catalog-service
spec:
  selector:
    app: catalog-service
  ports:
  - port: 3003
    targetPort: 3003
  type: ClusterIP
```

## 📊 Monitoring and Observability

### Health Checks
```typescript
// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
```

### Metrics Collection
```typescript
// src/metrics/metrics.service.ts
import { Injectable } from '@nestjs/common';
import { register, Counter, Histogram } from 'prom-client';

@Injectable()
export class MetricsService {
  private httpRequestsTotal = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
  });

  private httpRequestDuration = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route'],
  });

  constructor() {
    register.registerMetric(this.httpRequestsTotal);
    register.registerMetric(this.httpRequestDuration);
  }

  incrementHttpRequests(method: string, route: string, statusCode: number) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode });
  }

  observeHttpDuration(method: string, route: string, duration: number) {
    this.httpRequestDuration.observe({ method, route }, duration);
  }

  getMetrics() {
    return register.metrics();
  }
}
```

This comprehensive backend services documentation provides a complete foundation for building scalable, production-ready microservices using NestJS. Each service is designed to be independently deployable while maintaining system coherence through well-defined APIs and event-driven communication.

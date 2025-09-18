import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';
import { VendorModule } from './vendor/vendor.module';
import { KycModule } from './kyc/kyc.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PayoutModule } from './payout/payout.module';
import { HealthModule } from './health/health.module';
import { LoggingModule } from './common/logging/logging.module';
import { KafkaModule } from './kafka/kafka.module';
import { RedisModule } from './redis/redis.module';
import { LoggingInterceptor } from './common/logging/logging.interceptor';
import { ResponseTransformInterceptor } from './common/interceptors/response-transform.interceptor';
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // Database
    MongooseModule.forRootAsync({
      useFactory: (configService) => ({
        uri: configService.get<string>('database.mongodb.uri'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: ['ConfigService'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 200,
      },
    ]),

    // Core modules
    LoggingModule,
    KafkaModule,
    RedisModule,
    HealthModule,

    // Feature modules
    VendorModule,
    KycModule,
    AnalyticsModule,
    PayoutModule,
  ],
  providers: [
    // Global guards
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

    // Global interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
  ],
})
export class AppModule {}

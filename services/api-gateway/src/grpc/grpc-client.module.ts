import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'autopilot.auth',
            protoPath: join(__dirname, '../../../shared/proto/auth.proto'),
            url: configService.get<string>('services.auth.url'),
            ...configService.get('grpc.options'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'CATALOG_PACKAGE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'autopilot.catalog',
            protoPath: join(__dirname, '../../../shared/proto/catalog.proto'),
            url: configService.get<string>('services.catalog.url'),
            ...configService.get('grpc.options'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'PAYMENT_PACKAGE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'autopilot.payment',
            protoPath: join(__dirname, '../../../shared/proto/payment.proto'),
            url: configService.get<string>('services.payment.url'),
            ...configService.get('grpc.options'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'LICENSE_PACKAGE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'autopilot.license',
            protoPath: join(__dirname, '../../../shared/proto/license.proto'),
            url: configService.get<string>('services.license.url'),
            ...configService.get('grpc.options'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'NOTIFICATION_PACKAGE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'autopilot.notification',
            protoPath: join(__dirname, '../../../shared/proto/notification.proto'),
            url: configService.get<string>('services.notification.url'),
            ...configService.get('grpc.options'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientModule {}

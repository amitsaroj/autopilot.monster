import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { Product, ProductSchema } from './schemas/product.schema';
import { Category, CategorySchema } from '../category/schemas/category.schema';
import { KafkaModule } from '../kafka/kafka.module';
import { ElasticsearchModule } from '../elasticsearch/elasticsearch.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
    JwtModule.registerAsync({
      useFactory: (configService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
      inject: ['ConfigService'],
    }),
    KafkaModule,
    ElasticsearchModule,
    RedisModule,
  ],
  controllers: [CatalogController],
  providers: [CatalogService],
  exports: [CatalogService],
})
export class CatalogModule {}

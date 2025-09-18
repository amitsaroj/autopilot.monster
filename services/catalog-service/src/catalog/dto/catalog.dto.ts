import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsArray, IsEnum, IsBoolean, IsObject, ValidateNested, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class PricingDto {
  @ApiProperty({ 
    example: 'PRODUCT_PRICING_TYPE_ONE_TIME',
    enum: ['PRODUCT_PRICING_TYPE_ONE_TIME', 'PRODUCT_PRICING_TYPE_SUBSCRIPTION', 'PRODUCT_PRICING_TYPE_FREEMIUM']
  })
  @IsEnum(['PRODUCT_PRICING_TYPE_ONE_TIME', 'PRODUCT_PRICING_TYPE_SUBSCRIPTION', 'PRODUCT_PRICING_TYPE_FREEMIUM'])
  type: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 79.99, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountPrice?: number;

  @ApiProperty({ example: '2024-12-31T23:59:59Z', required: false })
  @IsOptional()
  @IsDateString()
  discountUntil?: string;

  @ApiProperty({ example: 'USD', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ type: [Object], required: false })
  @IsOptional()
  @IsArray()
  tiers?: any[];
}

export class FileDto {
  @ApiProperty({ example: 'file-id-123' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'product-file.zip' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'https://storage.example.com/files/product-file.zip' })
  @IsString()
  url: string;

  @ApiProperty({ example: 1024000 })
  @IsNumber()
  size: number;

  @ApiProperty({ example: 'application/zip' })
  @IsString()
  mimeType: string;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  downloadCount?: number;
}

export class ScreenshotDto {
  @ApiProperty({ example: 'https://storage.example.com/screenshots/screenshot1.jpg' })
  @IsString()
  url: string;

  @ApiProperty({ example: 'Main dashboard view' })
  @IsString()
  caption: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  order: number;
}

export class MetadataDto {
  @ApiProperty({ example: '1.0.0', required: false })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiProperty({ example: ['Windows 10', 'macOS 11+'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  compatibility?: string[];

  @ApiProperty({ example: ['Node.js 16+', 'Python 3.8+'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @ApiProperty({ example: 'https://docs.example.com', required: false })
  @IsOptional()
  @IsString()
  documentationUrl?: string;

  @ApiProperty({ example: 'https://demo.example.com', required: false })
  @IsOptional()
  @IsString()
  demoUrl?: string;

  @ApiProperty({ example: 'https://github.com/example/repo', required: false })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Advanced AI Workflow' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'A comprehensive AI workflow automation tool...' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Automate your workflows with AI' })
  @IsString()
  shortDescription: string;

  @ApiProperty({ 
    example: 'PRODUCT_TYPE_WORKFLOW',
    enum: ['PRODUCT_TYPE_WORKFLOW', 'PRODUCT_TYPE_TEMPLATE', 'PRODUCT_TYPE_AGENT', 'PRODUCT_TYPE_INTEGRATION']
  })
  @IsEnum(['PRODUCT_TYPE_WORKFLOW', 'PRODUCT_TYPE_TEMPLATE', 'PRODUCT_TYPE_AGENT', 'PRODUCT_TYPE_INTEGRATION'])
  type: string;

  @ApiProperty({ example: '64f8a1b2c3d4e5f6a7b8c9d0' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: ['ai', 'automation', 'workflow'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ type: PricingDto })
  @ValidateNested()
  @Type(() => PricingDto)
  pricing: PricingDto;

  @ApiProperty({ type: [FileDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files?: FileDto[];

  @ApiProperty({ type: [ScreenshotDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScreenshotDto)
  screenshots?: ScreenshotDto[];

  @ApiProperty({ type: MetadataDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;
}

export class UpdateProductDto {
  @ApiProperty({ example: 'Advanced AI Workflow v2', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Updated description...', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Updated short description', required: false })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({ example: '64f8a1b2c3d4e5f6a7b8c9d0', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ example: ['ai', 'automation', 'workflow', 'updated'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ type: PricingDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => PricingDto)
  pricing?: PricingDto;

  @ApiProperty({ type: [FileDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FileDto)
  files?: FileDto[];

  @ApiProperty({ type: [ScreenshotDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScreenshotDto)
  screenshots?: ScreenshotDto[];

  @ApiProperty({ type: MetadataDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  metadata?: MetadataDto;
}

export class GetProductsDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ example: '64f8a1b2c3d4e5f6a7b8c9d0', required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ 
    example: 'PRODUCT_TYPE_WORKFLOW',
    enum: ['PRODUCT_TYPE_WORKFLOW', 'PRODUCT_TYPE_TEMPLATE', 'PRODUCT_TYPE_AGENT', 'PRODUCT_TYPE_INTEGRATION'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['PRODUCT_TYPE_WORKFLOW', 'PRODUCT_TYPE_TEMPLATE', 'PRODUCT_TYPE_AGENT', 'PRODUCT_TYPE_INTEGRATION'])
  type?: string;

  @ApiProperty({ 
    example: 'PRODUCT_STATUS_APPROVED',
    enum: ['PRODUCT_STATUS_APPROVED', 'PRODUCT_STATUS_PENDING', 'PRODUCT_STATUS_REJECTED', 'PRODUCT_STATUS_ARCHIVED'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['PRODUCT_STATUS_APPROVED', 'PRODUCT_STATUS_PENDING', 'PRODUCT_STATUS_REJECTED', 'PRODUCT_STATUS_ARCHIVED'])
  status?: string;

  @ApiProperty({ 
    example: { minPrice: 0, maxPrice: 1000 },
    required: false 
  })
  @IsOptional()
  @IsObject()
  priceRange?: {
    minPrice?: number;
    maxPrice?: number;
  };

  @ApiProperty({ example: 'createdAt', required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ example: 'desc', required: false })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: string;
}

export class SearchProductsDto {
  @ApiProperty({ example: 'AI workflow automation', required: false })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({ example: ['64f8a1b2c3d4e5f6a7b8c9d0'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiProperty({ example: ['PRODUCT_TYPE_WORKFLOW'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  types?: string[];

  @ApiProperty({ 
    example: { minPrice: 0, maxPrice: 1000 },
    required: false 
  })
  @IsOptional()
  @IsObject()
  priceRange?: {
    minPrice?: number;
    maxPrice?: number;
  };

  @ApiProperty({ example: ['ai', 'automation'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: 4.0, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;
}

export class GetProductAnalyticsDto {
  @ApiProperty({ example: 1640995200000, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  startDate?: number;

  @ApiProperty({ example: 1641081600000, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  endDate?: number;
}

export class TrackProductViewDto {
  @ApiProperty({ example: '192.168.1.1', required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({ example: 'Mozilla/5.0...', required: false })
  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class TrackProductDownloadDto {
  @ApiProperty({ example: 'file-id-123' })
  @IsString()
  fileId: string;
}

export class UpdateProductStatusDto {
  @ApiProperty({ 
    example: 'PRODUCT_STATUS_APPROVED',
    enum: ['PRODUCT_STATUS_APPROVED', 'PRODUCT_STATUS_PENDING', 'PRODUCT_STATUS_REJECTED', 'PRODUCT_STATUS_ARCHIVED']
  })
  @IsEnum(['PRODUCT_STATUS_APPROVED', 'PRODUCT_STATUS_PENDING', 'PRODUCT_STATUS_REJECTED', 'PRODUCT_STATUS_ARCHIVED'])
  status: string;

  @ApiProperty({ example: 'Product meets all requirements', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class DeleteProductDto {
  @ApiProperty({ example: 'Product no longer available' })
  @IsString()
  reason: string;
}

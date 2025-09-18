import { IsOptional, IsString, IsNumber, IsEnum, IsBoolean, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserQueryDto {
  @ApiPropertyOptional({ description: 'Search term for users', example: 'john' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by role', enum: ['user', 'vendor', 'admin'] })
  @IsOptional()
  @IsEnum(['user', 'vendor', 'admin'])
  role?: string;

  @ApiPropertyOptional({ description: 'Filter by subscription plan', enum: ['free', 'basic', 'premium', 'enterprise'] })
  @IsOptional()
  @IsEnum(['free', 'basic', 'premium', 'enterprise'])
  subscriptionPlan?: string;

  @ApiPropertyOptional({ description: 'Filter by subscription status', enum: ['active', 'inactive', 'cancelled', 'past_due'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'cancelled', 'past_due'])
  subscriptionStatus?: string;

  @ApiPropertyOptional({ description: 'Filter by active status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filter by email verification status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiPropertyOptional({ description: 'Filter by tags', example: 'premium,enterprise' })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ description: 'Sort field', enum: ['createdAt', 'email', 'firstName', 'lastName', 'lastLoginAt'] })
  @IsOptional()
  @IsEnum(['createdAt', 'email', 'firstName', 'lastName', 'lastLoginAt'])
  sortBy?: string;

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Date range start', example: '2023-01-01' })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Date range end', example: '2023-12-31' })
  @IsOptional()
  @IsString()
  dateTo?: string;
}

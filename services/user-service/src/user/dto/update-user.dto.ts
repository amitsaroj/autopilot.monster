import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsObject, IsEnum, IsString, IsBoolean, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ description: 'User active status' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Email verification status' })
  @IsOptional()
  @IsBoolean()
  isEmailVerified?: boolean;

  @ApiPropertyOptional({ description: 'Phone verification status' })
  @IsOptional()
  @IsBoolean()
  isPhoneVerified?: boolean;

  @ApiPropertyOptional({ description: 'Subscription plan', enum: ['free', 'basic', 'premium', 'enterprise'] })
  @IsOptional()
  @IsEnum(['free', 'basic', 'premium', 'enterprise'])
  subscriptionPlan?: string;

  @ApiPropertyOptional({ description: 'Subscription status', enum: ['active', 'inactive', 'cancelled', 'past_due'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'cancelled', 'past_due'])
  subscriptionStatus?: string;

  @ApiPropertyOptional({ description: 'Billing information' })
  @IsOptional()
  @IsObject()
  billing?: {
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    taxId?: string;
    companyName?: string;
  };

  @ApiPropertyOptional({ description: 'User metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class UpdateUserPreferencesDto {
  @ApiPropertyOptional({ description: 'Notification preferences' })
  @IsOptional()
  @IsObject()
  notifications?: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };

  @ApiPropertyOptional({ description: 'Privacy preferences' })
  @IsOptional()
  @IsObject()
  privacy?: {
    profileVisibility: 'public' | 'private' | 'friends';
    showEmail: boolean;
    showPhone: boolean;
  };

  @ApiPropertyOptional({ description: 'Theme preference', enum: ['light', 'dark', 'auto'] })
  @IsOptional()
  @IsEnum(['light', 'dark', 'auto'])
  theme?: string;

  @ApiPropertyOptional({ description: 'Language preference' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: 'Timezone preference' })
  @IsOptional()
  @IsString()
  timezone?: string;
}

export class UpdateUserPasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  newPassword: string;
}

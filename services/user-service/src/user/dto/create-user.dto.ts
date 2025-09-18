import { IsEmail, IsString, IsOptional, IsEnum, IsBoolean, IsObject, IsArray, IsDateString, IsPhoneNumber, IsUrl, MinLength, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiPropertyOptional({ description: 'User avatar URL', example: 'https://example.com/avatar.jpg' })
  @IsOptional()
  @IsUrl()
  avatar?: string;

  @ApiPropertyOptional({ description: 'User phone number', example: '+1234567890' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiPropertyOptional({ description: 'User date of birth', example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'User bio', example: 'Software developer and AI enthusiast' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiPropertyOptional({ description: 'User website', example: 'https://johndoe.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ description: 'User location', example: 'San Francisco, CA' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @ApiPropertyOptional({ description: 'User timezone', example: 'America/New_York' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ description: 'User language preference', example: 'en' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: 'User role', enum: ['user', 'vendor', 'admin'], default: 'user' })
  @IsOptional()
  @IsEnum(['user', 'vendor', 'admin'])
  role?: string;

  @ApiPropertyOptional({ description: 'User preferences' })
  @IsOptional()
  @IsObject()
  preferences?: {
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'friends';
      showEmail: boolean;
      showPhone: boolean;
    };
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
  };

  @ApiPropertyOptional({ description: 'Social media links' })
  @IsOptional()
  @IsObject()
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };

  @ApiPropertyOptional({ description: 'User tags', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

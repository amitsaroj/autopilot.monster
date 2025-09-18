import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsBoolean, IsEnum, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ example: 'Acme Corp', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  company?: string;

  @ApiProperty({ 
    example: 'USER_ROLE_CUSTOMER',
    enum: ['USER_ROLE_CUSTOMER', 'USER_ROLE_VENDOR', 'USER_ROLE_ADMIN'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['USER_ROLE_CUSTOMER', 'USER_ROLE_VENDOR', 'USER_ROLE_ADMIN'])
  role?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  password: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  refreshToken: string;
}

export class LogoutDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  accessToken: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'abc123def456...' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
  newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'CurrentPassword123!' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  })
  newPassword: string;
}

export class ValidateTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  accessToken: string;
}

export class GetUserByTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  accessToken: string;
}

export class UpdateProfileDto {
  @ApiProperty({ example: 'John', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({ example: 'Acme Corp', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  company?: string;

  @ApiProperty({ example: 'Software developer with 5 years experience', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ 
    example: {
      website: 'https://johndoe.com',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe',
      github: 'https://github.com/johndoe'
    },
    required: false 
  })
  @IsOptional()
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export class GoogleAuthDto {
  @ApiProperty({ example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2NzAyOT...' })
  @IsString()
  idToken: string;
}

export class GetUsersDto {
  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  page?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  limit?: number;

  @ApiProperty({ example: 'john', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ 
    example: 'USER_ROLE_CUSTOMER',
    enum: ['USER_ROLE_CUSTOMER', 'USER_ROLE_VENDOR', 'USER_ROLE_ADMIN', 'USER_ROLE_SUPER_ADMIN'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['USER_ROLE_CUSTOMER', 'USER_ROLE_VENDOR', 'USER_ROLE_ADMIN', 'USER_ROLE_SUPER_ADMIN'])
  role?: string;

  @ApiProperty({ 
    example: 'USER_STATUS_ACTIVE',
    enum: ['USER_STATUS_ACTIVE', 'USER_STATUS_PENDING', 'USER_STATUS_SUSPENDED', 'USER_STATUS_DELETED'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['USER_STATUS_ACTIVE', 'USER_STATUS_PENDING', 'USER_STATUS_SUSPENDED', 'USER_STATUS_DELETED'])
  status?: string;
}

export class UpdateUserStatusDto {
  @ApiProperty({ 
    example: 'USER_STATUS_ACTIVE',
    enum: ['USER_STATUS_ACTIVE', 'USER_STATUS_PENDING', 'USER_STATUS_SUSPENDED', 'USER_STATUS_DELETED']
  })
  @IsEnum(['USER_STATUS_ACTIVE', 'USER_STATUS_PENDING', 'USER_STATUS_SUSPENDED', 'USER_STATUS_DELETED'])
  status: string;

  @ApiProperty({ example: 'User requested account activation', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class DeleteUserDto {
  @ApiProperty({ example: 'User requested account deletion' })
  @IsString()
  reason: string;
}

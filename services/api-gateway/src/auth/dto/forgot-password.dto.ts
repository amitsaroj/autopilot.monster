import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email address to send password reset link',
    example: 'user@autopilot.monster',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;
}

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('kyc')
@Controller('api/v1/kyc')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('submit')
  @ApiOperation({ summary: 'Submit KYC documents' })
  @ApiResponse({ status: 201, description: 'KYC documents submitted successfully' })
  @UseGuards(RolesGuard)
  @Roles('vendor')
  async submitKycDocuments(@Request() req, @Body() documents: any) {
    return this.kycService.submitKycDocuments(req.user.sub, documents);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get KYC status' })
  @ApiResponse({ status: 200, description: 'KYC status retrieved successfully' })
  @UseGuards(RolesGuard)
  @Roles('vendor')
  async getKycStatus(@Request() req) {
    return this.kycService.getKycStatus(req.user.sub);
  }

  @Post(':vendorId/verify')
  @ApiOperation({ summary: 'Verify KYC documents (admin only)' })
  @ApiResponse({ status: 200, description: 'KYC verification completed' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async verifyKycDocuments(@Param('vendorId') vendorId: string, @Body() verificationData: any) {
    return this.kycService.verifyKycDocuments(vendorId, verificationData);
  }

  @Post(':vendorId/reject')
  @ApiOperation({ summary: 'Reject KYC documents (admin only)' })
  @ApiResponse({ status: 200, description: 'KYC documents rejected' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async rejectKycDocuments(@Param('vendorId') vendorId: string, @Body('reason') reason: string) {
    return this.kycService.rejectKycDocuments(vendorId, reason);
  }
}

import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('analytics')
@Controller('api/v1/analytics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('vendor')
  @ApiOperation({ summary: 'Get vendor analytics' })
  @ApiResponse({ status: 200, description: 'Vendor analytics retrieved successfully' })
  @UseGuards(RolesGuard)
  @Roles('vendor')
  async getVendorAnalytics(@Request() req) {
    return this.analyticsService.getVendorAnalytics(req.user.sub);
  }
}

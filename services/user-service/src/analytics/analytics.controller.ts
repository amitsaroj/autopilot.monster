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

  @Get('user')
  @ApiOperation({ summary: 'Get user analytics' })
  @ApiResponse({ status: 200, description: 'User analytics retrieved successfully' })
  async getUserAnalytics(@Request() req) {
    return this.analyticsService.getUserAnalytics(req.user.sub);
  }

  @Get('system')
  @ApiOperation({ summary: 'Get system analytics (admin only)' })
  @ApiResponse({ status: 200, description: 'System analytics retrieved successfully' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getSystemAnalytics() {
    return this.analyticsService.getSystemAnalytics();
  }
}

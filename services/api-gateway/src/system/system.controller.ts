import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SystemService } from './system.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('system')
@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Public()
  @Get('status')
  @ApiOperation({ summary: 'Get system status' })
  @ApiResponse({ status: 200, description: 'System status retrieved successfully' })
  async getSystemStatus() {
    return this.systemService.getSystemStatus();
  }

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Get system health' })
  @ApiResponse({ status: 200, description: 'System health retrieved successfully' })
  async getSystemHealth() {
    return this.systemService.getSystemHealth();
  }

  @Public()
  @Get('integrations')
  @ApiOperation({ summary: 'Get available integrations' })
  @ApiResponse({ status: 200, description: 'Integrations retrieved successfully' })
  async getIntegrations() {
    return this.systemService.getIntegrations();
  }

  @Get('integrations/:id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get integration status' })
  @ApiResponse({ status: 200, description: 'Integration status retrieved successfully' })
  async getIntegrationStatus(@Param('id') id: string, @GetUser() user: any) {
    return this.systemService.getIntegrationStatus({ integrationId: id, userId: user.id });
  }

  @Post('integrations/:id/connect')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Connect integration' })
  @ApiResponse({ status: 200, description: 'Integration connected successfully' })
  async connectIntegration(@Param('id') id: string, @Body() data: any, @GetUser() user: any) {
    return this.systemService.connectIntegration({ integrationId: id, userId: user.id, ...data });
  }

  @Delete('integrations/:id/disconnect')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Disconnect integration' })
  @ApiResponse({ status: 200, description: 'Integration disconnected successfully' })
  async disconnectIntegration(@Param('id') id: string, @GetUser() user: any) {
    return this.systemService.disconnectIntegration({ integrationId: id, userId: user.id });
  }

  // Legal pages endpoints
  @Public()
  @Get('legal/privacy')
  @ApiOperation({ summary: 'Get privacy policy' })
  @ApiResponse({ status: 200, description: 'Privacy policy retrieved successfully' })
  async getPrivacyPolicy() {
    return this.systemService.getLegalContent('privacy');
  }

  @Public()
  @Get('legal/terms')
  @ApiOperation({ summary: 'Get terms of service' })
  @ApiResponse({ status: 200, description: 'Terms of service retrieved successfully' })
  async getTermsOfService() {
    return this.systemService.getLegalContent('terms');
  }

  @Public()
  @Get('legal/cookies')
  @ApiOperation({ summary: 'Get cookie policy' })
  @ApiResponse({ status: 200, description: 'Cookie policy retrieved successfully' })
  async getCookiePolicy() {
    return this.systemService.getLegalContent('cookies');
  }

  @Public()
  @Get('legal/gdpr')
  @ApiOperation({ summary: 'Get GDPR compliance information' })
  @ApiResponse({ status: 200, description: 'GDPR information retrieved successfully' })
  async getGdprInfo() {
    return this.systemService.getLegalContent('gdpr');
  }

  @Public()
  @Get('legal/security')
  @ApiOperation({ summary: 'Get security policy' })
  @ApiResponse({ status: 200, description: 'Security policy retrieved successfully' })
  async getSecurityPolicy() {
    return this.systemService.getLegalContent('security');
  }

  @Public()
  @Get('legal/refund')
  @ApiOperation({ summary: 'Get refund policy' })
  @ApiResponse({ status: 200, description: 'Refund policy retrieved successfully' })
  async getRefundPolicy() {
    return this.systemService.getLegalContent('refund');
  }

  @Public()
  @Get('legal/shipping')
  @ApiOperation({ summary: 'Get shipping policy' })
  @ApiResponse({ status: 200, description: 'Shipping policy retrieved successfully' })
  async getShippingPolicy() {
    return this.systemService.getLegalContent('shipping');
  }

  @Public()
  @Get('legal/accessibility')
  @ApiOperation({ summary: 'Get accessibility statement' })
  @ApiResponse({ status: 200, description: 'Accessibility statement retrieved successfully' })
  async getAccessibilityStatement() {
    return this.systemService.getLegalContent('accessibility');
  }

  // Admin endpoints for managing legal content
  @Put('legal/:type')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update legal content' })
  @ApiResponse({ status: 200, description: 'Legal content updated successfully' })
  async updateLegalContent(@Param('type') type: string, @Body() data: any, @GetUser() user: any) {
    return this.systemService.updateLegalContent({ type, userId: user.id, ...data });
  }

  @Get('legal/:type/history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get legal content history' })
  @ApiResponse({ status: 200, description: 'Legal content history retrieved successfully' })
  async getLegalContentHistory(@Param('type') type: string, @GetUser() user: any) {
    return this.systemService.getLegalContentHistory({ type, userId: user.id });
  }

  // System settings endpoints
  @Get('settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get system settings' })
  @ApiResponse({ status: 200, description: 'System settings retrieved successfully' })
  async getSystemSettings(@GetUser() user: any) {
    return this.systemService.getSystemSettings({ userId: user.id });
  }

  @Put('settings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update system settings' })
  @ApiResponse({ status: 200, description: 'System settings updated successfully' })
  async updateSystemSettings(@Body() data: any, @GetUser() user: any) {
    return this.systemService.updateSystemSettings({ userId: user.id, ...data });
  }

  // Maintenance endpoints
  @Public()
  @Get('maintenance')
  @ApiOperation({ summary: 'Get maintenance status' })
  @ApiResponse({ status: 200, description: 'Maintenance status retrieved successfully' })
  async getMaintenanceStatus() {
    return this.systemService.getMaintenanceStatus();
  }

  @Post('maintenance/schedule')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Schedule maintenance' })
  @ApiResponse({ status: 201, description: 'Maintenance scheduled successfully' })
  async scheduleMaintenance(@Body() data: any, @GetUser() user: any) {
    return this.systemService.scheduleMaintenance({ ...data, userId: user.id });
  }

  @Post('maintenance/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel maintenance' })
  @ApiResponse({ status: 200, description: 'Maintenance cancelled successfully' })
  async cancelMaintenance(@Body() data: any, @GetUser() user: any) {
    return this.systemService.cancelMaintenance({ ...data, userId: user.id });
  }

  // Analytics endpoints
  @Get('analytics/usage')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get system usage analytics' })
  @ApiResponse({ status: 200, description: 'Usage analytics retrieved successfully' })
  async getUsageAnalytics(@Query() query: any, @GetUser() user: any) {
    return this.systemService.getUsageAnalytics({ ...query, userId: user.id });
  }

  @Get('analytics/performance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get system performance analytics' })
  @ApiResponse({ status: 200, description: 'Performance analytics retrieved successfully' })
  async getPerformanceAnalytics(@Query() query: any, @GetUser() user: any) {
    return this.systemService.getPerformanceAnalytics({ ...query, userId: user.id });
  }
}

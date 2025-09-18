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
import { PayoutService } from './payout.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('payouts')
@Controller('api/v1/payouts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PayoutController {
  constructor(private readonly payoutService: PayoutService) {}

  @Post('request')
  @ApiOperation({ summary: 'Request payout' })
  @ApiResponse({ status: 201, description: 'Payout request submitted successfully' })
  @UseGuards(RolesGuard)
  @Roles('vendor')
  async requestPayout(@Request() req, @Body('amount') amount: number) {
    return this.payoutService.requestPayout(req.user.sub, amount);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get payout history' })
  @ApiResponse({ status: 200, description: 'Payout history retrieved successfully' })
  @UseGuards(RolesGuard)
  @Roles('vendor')
  async getPayoutHistory(@Request() req) {
    return this.payoutService.getPayoutHistory(req.user.sub);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get payout statistics' })
  @ApiResponse({ status: 200, description: 'Payout stats retrieved successfully' })
  @UseGuards(RolesGuard)
  @Roles('vendor')
  async getPayoutStats(@Request() req) {
    return this.payoutService.getPayoutStats(req.user.sub);
  }

  @Post(':payoutId/process')
  @ApiOperation({ summary: 'Process payout (admin only)' })
  @ApiResponse({ status: 200, description: 'Payout processed successfully' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async processPayout(@Param('payoutId') payoutId: string) {
    return this.payoutService.processPayout(payoutId);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VendorService } from './vendor.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('vendors')
@Controller('api/v1/vendors')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vendor' })
  @ApiResponse({ status: 201, description: 'Vendor created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'Vendor already exists' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async create(@Body() createVendorDto: any) {
    return this.vendorService.create(createVendorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vendors with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Vendors retrieved successfully' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findAll(@Query() query: any) {
    return this.vendorService.findAll(query);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get vendor system analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getSystemAnalytics() {
    return this.vendorService.getSystemAnalytics();
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get current vendor profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @UseGuards(RolesGuard)
  @Roles('vendor')
  async getProfile(@Request() req) {
    return this.vendorService.findOne(req.user.sub);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update current vendor profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @UseGuards(RolesGuard)
  @Roles('vendor')
  async updateProfile(@Request() req, @Body() updateVendorDto: any) {
    return this.vendorService.update(req.user.sub, updateVendorDto);
  }

  @Get('analytics/my')
  @ApiOperation({ summary: 'Get vendor analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  @UseGuards(RolesGuard)
  @Roles('vendor')
  async getMyAnalytics(@Request() req) {
    return this.vendorService.getVendorAnalytics(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiResponse({ status: 200, description: 'Vendor retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async findOne(@Param('id') id: string) {
    return this.vendorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vendor by ID' })
  @ApiResponse({ status: 200, description: 'Vendor updated successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateVendorDto: any) {
    return this.vendorService.update(id, updateVendorDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update vendor status' })
  @ApiResponse({ status: 200, description: 'Vendor status updated successfully' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.vendorService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete vendor by ID' })
  @ApiResponse({ status: 200, description: 'Vendor deleted successfully' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  @UseGuards(RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.vendorService.remove(id);
  }
}

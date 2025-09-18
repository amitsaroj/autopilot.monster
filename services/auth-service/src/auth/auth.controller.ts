import { Controller, Post, Get, Patch, Delete, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { 
  RegisterDto, 
  LoginDto, 
  RefreshTokenDto, 
  LogoutDto, 
  ForgotPasswordDto, 
  ResetPasswordDto, 
  ChangePasswordDto, 
  ValidateTokenDto, 
  GetUserByTokenDto, 
  UpdateProfileDto, 
  GoogleAuthDto, 
  GetUsersDto, 
  UpdateUserStatusDto, 
  DeleteUserDto 
} from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 423, description: 'Account locked' })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout user' })
  @ApiBearerAuth()
  @ApiBody({ type: LogoutDto })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Body() logoutDto: LogoutDto, @Request() req) {
    return await this.authService.logout({
      ...logoutDto,
      userId: req.user.userId,
    });
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Change user password' })
  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Current password is incorrect' })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req) {
    return await this.authService.changePassword({
      ...changePasswordDto,
      userId: req.user.userId,
    });
  }

  @Public()
  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate access token' })
  @ApiBody({ type: ValidateTokenDto })
  @ApiResponse({ status: 200, description: 'Token validation result' })
  async validateToken(@Body() validateTokenDto: ValidateTokenDto) {
    return await this.authService.validateToken(validateTokenDto);
  }

  @Post('get-user-by-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by access token' })
  @ApiBody({ type: GetUserByTokenDto })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  async getUserByToken(@Body() getUserByTokenDto: GetUserByTokenDto) {
    return await this.authService.getUserByToken(getUserByTokenDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Request() req) {
    return await this.authService.getProfile({ userId: req.user.userId });
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Request() req) {
    return await this.authService.updateProfile({
      ...updateProfileDto,
      userId: req.user.userId,
    });
  }

  @Public()
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Google OAuth authentication' })
  @ApiBody({ type: GoogleAuthDto })
  @ApiResponse({ status: 200, description: 'Google authentication successful' })
  @ApiResponse({ status: 400, description: 'Invalid Google token' })
  async googleAuth(@Body() googleAuthDto: GoogleAuthDto) {
    return await this.authService.googleAuth(googleAuthDto);
  }

  @Public()
  @Post('github')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'GitHub OAuth authentication' })
  @ApiResponse({ status: 200, description: 'GitHub authentication successful' })
  @ApiResponse({ status: 400, description: 'Invalid GitHub token' })
  async githubAuth(@Body() body: { code: string }) {
    return await this.authService.githubAuth(body);
  }

  // Admin endpoints
  @Get('users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER_ROLE_ADMIN', 'USER_ROLE_SUPER_ADMIN')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getUsers(@Query() query: GetUsersDto) {
    return await this.authService.getUsers(query);
  }

  @Get('users/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER_ROLE_ADMIN', 'USER_ROLE_SUPER_ADMIN')
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getUserById(@Param('userId') userId: string) {
    return await this.authService.getUserById({ userId });
  }

  @Patch('users/:userId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER_ROLE_ADMIN', 'USER_ROLE_SUPER_ADMIN')
  @ApiOperation({ summary: 'Update user status (Admin only)' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserStatusDto })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async updateUserStatus(
    @Param('userId') userId: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto
  ) {
    return await this.authService.updateUserStatus({
      ...updateUserStatusDto,
      userId,
    });
  }

  @Delete('users/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('USER_ROLE_SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete user (Super Admin only)' })
  @ApiBearerAuth()
  @ApiBody({ type: DeleteUserDto })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteUser(
    @Param('userId') userId: string,
    @Body() deleteUserDto: DeleteUserDto
  ) {
    return await this.authService.deleteUser({
      ...deleteUserDto,
      userId,
    });
  }
}
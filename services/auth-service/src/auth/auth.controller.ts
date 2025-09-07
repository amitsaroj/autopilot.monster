import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Login')
  async login(data: any) {
    return this.authService.login(data);
  }

  @GrpcMethod('AuthService', 'Register')
  async register(data: any) {
    return this.authService.register(data);
  }

  @GrpcMethod('AuthService', 'RefreshToken')
  async refreshToken(data: any) {
    return this.authService.refreshToken(data);
  }

  @GrpcMethod('AuthService', 'Logout')
  async logout(data: any) {
    return this.authService.logout(data);
  }

  @GrpcMethod('AuthService', 'ForgotPassword')
  async forgotPassword(data: any) {
    return this.authService.forgotPassword(data);
  }

  @GrpcMethod('AuthService', 'ResetPassword')
  async resetPassword(data: any) {
    return this.authService.resetPassword(data);
  }

  @GrpcMethod('AuthService', 'ChangePassword')
  async changePassword(data: any) {
    return this.authService.changePassword(data);
  }

  @GrpcMethod('AuthService', 'ValidateToken')
  async validateToken(data: any) {
    return this.authService.validateToken(data);
  }

  @GrpcMethod('AuthService', 'GetUserByToken')
  async getUserByToken(data: any) {
    return this.authService.getUserByToken(data);
  }

  @GrpcMethod('AuthService', 'GetProfile')
  async getProfile(data: any) {
    return this.authService.getProfile(data);
  }

  @GrpcMethod('AuthService', 'UpdateProfile')
  async updateProfile(data: any) {
    return this.authService.updateProfile(data);
  }

  @GrpcMethod('AuthService', 'GoogleAuth')
  async googleAuth(data: any) {
    return this.authService.googleAuth(data);
  }

  @GrpcMethod('AuthService', 'GithubAuth')
  async githubAuth(data: any) {
    return this.authService.githubAuth(data);
  }

  @GrpcMethod('AuthService', 'GetUsers')
  async getUsers(data: any) {
    return this.authService.getUsers(data);
  }

  @GrpcMethod('AuthService', 'GetUserById')
  async getUserById(data: any) {
    return this.authService.getUserById(data);
  }

  @GrpcMethod('AuthService', 'UpdateUserStatus')
  async updateUserStatus(data: any) {
    return this.authService.updateUserStatus(data);
  }

  @GrpcMethod('AuthService', 'DeleteUser')
  async deleteUser(data: any) {
    return this.authService.deleteUser(data);
  }
}

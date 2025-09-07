import { apiClient, ApiResponse } from './client';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  company?: string;
  role?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
  refreshTokenExpiresAt: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  company?: string;
  role: string;
  status: string;
  emailVerified: boolean;
  avatarUrl?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  userId: string;
  requiresVerification: boolean;
}

export interface ProfileResponse {
  success: boolean;
  user: User;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  company?: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks?: Record<string, string>;
}

export class AuthAPI {
  // Authentication
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  }

  static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>('/auth/register', userData);
  }

  static async logout(): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/logout');
  }

  static async refreshToken(refreshToken: string): Promise<{ success: boolean; tokens: AuthTokens }> {
    return apiClient.post<{ success: boolean; tokens: AuthTokens }>('/auth/refresh', { refreshToken });
  }

  // Password management
  static async forgotPassword(email: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/forgot-password', { email });
  }

  static async resetPassword(token: string, newPassword: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/reset-password', { token, newPassword });
  }

  static async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/auth/change-password', { currentPassword, newPassword });
  }

  // Profile management
  static async getProfile(): Promise<ProfileResponse> {
    return apiClient.get<ProfileResponse>('/auth/profile');
  }

  static async updateProfile(profileData: UpdateProfileRequest): Promise<ProfileResponse> {
    return apiClient.post<ProfileResponse>('/auth/profile', profileData);
  }

  // OAuth
  static async googleAuth(): Promise<void> {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/google`;
  }

  static async githubAuth(): Promise<void> {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/github`;
  }

  // Token validation
  static async validateToken(token: string): Promise<{ isValid: boolean; userId?: string; permissions?: string[] }> {
    return apiClient.post<{ isValid: boolean; userId?: string; permissions?: string[] }>('/auth/validate', { token });
  }

  // Helper methods
  static isAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('access_token');
    }
    return false;
  }

  static getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  static setCurrentUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  static clearCurrentUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }
}

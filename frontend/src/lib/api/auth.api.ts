/**
 * Auth API - Authentication endpoints
 */

import apiClient from './client';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      userId: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export const authApi = {
  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/auth/register', data);
  },

  /**
   * Login user
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/auth/login', data);
  },

  /**
   * Get current user profile
   */
  getProfile: async (token: string): Promise<{ success: boolean; data: UserProfile }> => {
    return apiClient.get<{ success: boolean; data: UserProfile }>('/api/auth/profile', { token });
  },

  /**
   * Update user profile
   */
  updateProfile: async (token: string, data: Partial<UserProfile>): Promise<{ success: boolean; data: UserProfile }> => {
    return apiClient.put<{ success: boolean; data: UserProfile }>('/api/auth/profile', data, { token });
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/auth/refresh', { refreshToken });
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>('/api/auth/forgot-password', { email });
  },

  /**
   * Reset password
   */
  resetPassword: async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    return apiClient.post<{ success: boolean; message: string }>('/api/auth/reset-password', { token, newPassword });
  },
};

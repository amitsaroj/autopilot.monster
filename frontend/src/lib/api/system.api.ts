/**
 * System API - System status and health check endpoints
 */

import apiClient from './client';

export interface SystemStatus {
  status: 'operational' | 'degraded' | 'down' | 'maintenance';
  uptime: number;
  version: string;
  lastUpdated: string;
}

export interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastChecked: string;
}

export interface SystemHealth {
  overall: SystemStatus;
  services: ServiceStatus[];
  incidents: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'critical' | 'major' | 'minor';
    status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
    startTime: string;
    resolvedTime?: string;
    affectedServices: string[];
  }>;
  upcomingMaintenance: Array<{
    id: string;
    title: string;
    description: string;
    scheduledStart: string;
    scheduledEnd: string;
    affectedServices: string[];
  }>;
}

export interface SystemMetrics {
  timestamp: string;
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    incoming: number;
    outgoing: number;
  };
  requests: {
    total: number;
    successful: number;
    failed: number;
    averageResponseTime: number;
  };
}

export const systemApi = {
  /**
   * Get system status
   */
  getStatus: async () => {
    return apiClient.get<{ success: boolean; data: SystemStatus }>(
      '/api/system/status'
    );
  },

  /**
   * Get system health
   */
  getHealth: async () => {
    return apiClient.get<{ success: boolean; data: SystemHealth }>(
      '/api/system/health'
    );
  },

  /**
   * Get service status
   */
  getServiceStatus: async (serviceName: string) => {
    return apiClient.get<{ success: boolean; data: ServiceStatus }>(
      `/api/system/services/${serviceName}`
    );
  },

  /**
   * Get system metrics
   */
  getMetrics: async (token: string, timeRange?: '1h' | '24h' | '7d' | '30d') => {
    const params = timeRange ? `?range=${timeRange}` : '';
    return apiClient.get<{ success: boolean; data: SystemMetrics[] }>(
      `/api/system/metrics${params}`,
      { token }
    );
  },

  /**
   * Subscribe to status updates
   */
  subscribeToUpdates: async (email: string) => {
    return apiClient.post<{ success: boolean; message: string }>(
      '/api/system/subscribe',
      { email },
      {}
    );
  },

  /**
   * Get incident history
   */
  getIncidentHistory: async (params?: { page?: number; limit?: number; severity?: string }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }
    return apiClient.get<{
      success: boolean;
      data: {
        incidents: SystemHealth['incidents'];
        pagination: {
          total: number;
          page: number;
          limit: number;
          pages: number;
        };
      };
    }>(`/api/system/incidents?${queryParams.toString()}`);
  },
};

export default systemApi;


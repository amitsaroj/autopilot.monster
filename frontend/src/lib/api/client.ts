import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          // Update tokens
          localStorage.setItem('auth_token', accessToken);
          localStorage.setItem('refresh_token', newRefreshToken);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get(url, config).then(response => response.data),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post(url, data, config).then(response => response.data),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put(url, data, config).then(response => response.data),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch(url, data, config).then(response => response.data),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete(url, config).then(response => response.data),
};

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/v1/auth/login', credentials),

  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => api.post('/api/v1/auth/register', userData),

  logout: () => api.post('/api/v1/auth/logout'),

  refreshToken: (refreshToken: string) =>
    api.post('/api/v1/auth/refresh', { refreshToken }),

  forgotPassword: (email: string) =>
    api.post('/api/v1/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/api/v1/auth/reset-password', { token, password }),

  verifyEmail: (token: string) =>
    api.post(`/api/v1/auth/verify-email/${token}`),

  getProfile: () => api.get('/api/v1/auth/profile'),

  updateProfile: (profileData: any) =>
    api.patch('/api/v1/auth/profile', profileData),
};

// User API
export const userApi = {
  getProfile: () => api.get('/api/v1/users/profile'),
  updateProfile: (profileData: any) => api.patch('/api/v1/users/profile', profileData),
  updatePreferences: (preferences: any) => api.patch('/api/v1/users/profile/preferences', preferences),
  updatePassword: (passwordData: { currentPassword: string; newPassword: string }) =>
    api.patch('/api/v1/users/profile/password', passwordData),
  getOrders: (query?: any) => api.get('/api/v1/orders', { params: query }),
  getWishlist: () => api.get('/api/v1/wishlist'),
  addToWishlist: (productId: string, productData: any) =>
    api.post(`/api/v1/wishlist/${productId}`, productData),
  removeFromWishlist: (productId: string) => api.delete(`/api/v1/wishlist/${productId}`),
  getAnalytics: () => api.get('/api/v1/analytics/user'),
};

// Product API
export const productApi = {
  getProducts: (query?: any) => api.get('/api/v1/catalog/products', { params: query }),
  getProduct: (id: string) => api.get(`/api/v1/catalog/products/${id}`),
  searchProducts: (query: string, filters?: any) =>
    api.get('/api/v1/catalog/products/search', { params: { query, ...filters } }),
  getCategories: () => api.get('/api/v1/catalog/categories'),
  getFeaturedProducts: () => api.get('/api/v1/catalog/products/featured'),
  getTrendingProducts: () => api.get('/api/v1/catalog/products/trending'),
  getProductReviews: (productId: string) => api.get(`/api/v1/catalog/products/${productId}/reviews`),
  addProductReview: (productId: string, review: any) =>
    api.post(`/api/v1/catalog/products/${productId}/reviews`, review),
  trackView: (productId: string, data?: any) =>
    api.post(`/api/v1/catalog/products/${productId}/track-view`, data),
  trackDownload: (productId: string, fileId: string) =>
    api.post(`/api/v1/catalog/products/${productId}/track-download`, { fileId }),
};

// Order API
export const orderApi = {
  createOrder: (orderData: any) => api.post('/api/v1/orders', orderData),
  getOrders: (query?: any) => api.get('/api/v1/orders', { params: query }),
  getOrder: (id: string) => api.get(`/api/v1/orders/${id}`),
  updateOrder: (id: string, orderData: any) => api.patch(`/api/v1/orders/${id}`, orderData),
  cancelOrder: (id: string) => api.patch(`/api/v1/orders/${id}/cancel`),
  getOrderStats: () => api.get('/api/v1/orders/stats'),
};

// Payment API
export const paymentApi = {
  createPaymentIntent: (paymentData: any) => api.post('/api/v1/payment/create-intent', paymentData),
  confirmPayment: (paymentData: any) => api.post('/api/v1/payment/confirm', paymentData),
  getPaymentHistory: (query?: any) => api.get('/api/v1/payment/history', { params: query }),
  getPayment: (id: string) => api.get(`/api/v1/payment/${id}`),
  processRefund: (paymentId: string, amount: number, reason: string) =>
    api.post('/api/v1/payment/refund', { paymentId, amount, reason }),
  getSubscriptions: (query?: any) => api.get('/api/v1/payment/subscription/history', { params: query }),
  createSubscription: (subscriptionData: any) => api.post('/api/v1/payment/subscription/create', subscriptionData),
  updateSubscription: (id: string, subscriptionData: any) =>
    api.patch(`/api/v1/payment/subscription/${id}`, subscriptionData),
  cancelSubscription: (id: string, reason: string) => 
    api.patch(`/api/v1/payment/subscription/${id}/cancel`, { reason }),
  getPaymentMethods: () => api.get('/api/v1/payment/methods'),
  getSupportedCurrencies: () => api.get('/api/v1/payment/currencies'),
};

// Vendor API
export const vendorApi = {
  getProfile: () => api.get('/api/v1/vendors/profile'),
  updateProfile: (profileData: any) => api.patch('/api/v1/vendors/profile', profileData),
  getAnalytics: () => api.get('/api/v1/analytics/vendor'),
  submitKyc: (documents: any) => api.post('/api/v1/kyc/submit', documents),
  getKycStatus: () => api.get('/api/v1/kyc/status'),
  requestPayout: (amount: number) => api.post('/api/v1/payouts/request', { amount }),
  getPayoutHistory: () => api.get('/api/v1/payouts/history'),
  getPayoutStats: () => api.get('/api/v1/payouts/stats'),
};

// Admin API
export const adminApi = {
  // Admin Management
  createAdmin: (adminData: any) => api.post('/api/v1/admin/admin', adminData),
  getAdmins: (query?: any) => api.get('/api/v1/admin/admin', { params: query }),
  getAdmin: (id: string) => api.get(`/api/v1/admin/admin/${id}`),
  updateAdmin: (id: string, adminData: any) => api.patch(`/api/v1/admin/admin/${id}`, adminData),
  deleteAdmin: (id: string) => api.delete(`/api/v1/admin/admin/${id}`),
  
  // Dashboard
  getDashboardStats: () => api.get('/api/v1/admin/dashboard'),
  getSystemHealth: () => api.get('/api/v1/admin/health'),
  
  // User Management
  getUsers: (query?: any) => api.get('/api/v1/admin/users', { params: query }),
  getUser: (id: string) => api.get(`/api/v1/admin/users/${id}`),
  updateUser: (id: string, userData: any) => api.patch(`/api/v1/admin/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/api/v1/admin/users/${id}`),
  suspendUser: (id: string, reason: string) => api.patch(`/api/v1/admin/users/${id}/suspend`, { reason }),
  activateUser: (id: string) => api.patch(`/api/v1/admin/users/${id}/activate`),
  
  // Vendor Management
  getVendors: (query?: any) => api.get('/api/v1/admin/vendors', { params: query }),
  getVendor: (id: string) => api.get(`/api/v1/admin/vendors/${id}`),
  updateVendor: (id: string, vendorData: any) => api.patch(`/api/v1/admin/vendors/${id}`, vendorData),
  deleteVendor: (id: string) => api.delete(`/api/v1/admin/vendors/${id}`),
  approveVendor: (id: string) => api.patch(`/api/v1/admin/vendors/${id}/approve`),
  rejectVendor: (id: string, reason: string) => api.patch(`/api/v1/admin/vendors/${id}/reject`, { reason }),
  
  // Product Management
  getProducts: (query?: any) => api.get('/api/v1/admin/products', { params: query }),
  getProduct: (id: string) => api.get(`/api/v1/admin/products/${id}`),
  updateProduct: (id: string, productData: any) => api.patch(`/api/v1/admin/products/${id}`, productData),
  deleteProduct: (id: string) => api.delete(`/api/v1/admin/products/${id}`),
  approveProduct: (id: string) => api.patch(`/api/v1/admin/products/${id}/approve`),
  rejectProduct: (id: string, reason: string) => api.patch(`/api/v1/admin/products/${id}/reject`, { reason }),
  
  // Order Management
  getOrders: (query?: any) => api.get('/api/v1/admin/orders', { params: query }),
  getOrder: (id: string) => api.get(`/api/v1/admin/orders/${id}`),
  updateOrder: (id: string, orderData: any) => api.patch(`/api/v1/admin/orders/${id}`, orderData),
  cancelOrder: (id: string, reason: string) => api.patch(`/api/v1/admin/orders/${id}/cancel`, { reason }),
  
  // Analytics
  getAnalytics: () => api.get('/api/v1/admin/analytics'),
  getRevenueAnalytics: (period: string) => api.get(`/api/v1/admin/analytics/revenue?period=${period}`),
  getUserAnalytics: (period: string) => api.get(`/api/v1/admin/analytics/users?period=${period}`),
  getProductAnalytics: (period: string) => api.get(`/api/v1/admin/analytics/products?period=${period}`),
  
  // System Settings
  getSettings: () => api.get('/api/v1/admin/settings'),
  updateSettings: (settings: any) => api.patch('/api/v1/admin/settings', settings),
  getSystemStatus: () => api.get('/api/v1/admin/system/status'),
};

// Content API
export const contentApi = {
  // Blog Management
  getBlogPosts: (query?: any) => api.get('/api/v1/blog/posts', { params: query }),
  getBlogPost: (slug: string) => api.get(`/api/v1/blog/posts/${slug}`),
  createBlogPost: (postData: any) => api.post('/api/v1/blog/posts', postData),
  updateBlogPost: (id: string, postData: any) => api.patch(`/api/v1/blog/posts/${id}`, postData),
  deleteBlogPost: (id: string) => api.delete(`/api/v1/blog/posts/${id}`),
  publishBlogPost: (id: string) => api.patch(`/api/v1/blog/posts/${id}/publish`),
  unpublishBlogPost: (id: string) => api.patch(`/api/v1/blog/posts/${id}/unpublish`),
  
  // Help Center
  getHelpArticles: (query?: any) => api.get('/api/v1/help/articles', { params: query }),
  getHelpArticle: (id: string) => api.get(`/api/v1/help/articles/${id}`),
  getHelpCategories: () => api.get('/api/v1/help/categories'),
  createHelpArticle: (articleData: any) => api.post('/api/v1/help/articles', articleData),
  updateHelpArticle: (id: string, articleData: any) => api.patch(`/api/v1/help/articles/${id}`, articleData),
  deleteHelpArticle: (id: string) => api.delete(`/api/v1/help/articles/${id}`),
  searchHelpArticles: (query: string) => api.get(`/api/v1/help/articles/search?q=${query}`),
  
  // Tutorials
  getTutorials: (query?: any) => api.get('/api/v1/tutorials', { params: query }),
  getTutorial: (id: string) => api.get(`/api/v1/tutorials/${id}`),
  createTutorial: (tutorialData: any) => api.post('/api/v1/tutorials', tutorialData),
  updateTutorial: (id: string, tutorialData: any) => api.patch(`/api/v1/tutorials/${id}`, tutorialData),
  deleteTutorial: (id: string) => api.delete(`/api/v1/tutorials/${id}`),
  getTutorialCategories: () => api.get('/api/v1/tutorials/categories'),
  
  // Resources
  getResources: (query?: any) => api.get('/api/v1/resources', { params: query }),
  getResource: (id: string) => api.get(`/api/v1/resources/${id}`),
  createResource: (resourceData: any) => api.post('/api/v1/resources', resourceData),
  updateResource: (id: string, resourceData: any) => api.patch(`/api/v1/resources/${id}`, resourceData),
  deleteResource: (id: string) => api.delete(`/api/v1/resources/${id}`),
  downloadResource: (id: string) => api.get(`/api/v1/resources/${id}/download`),
  
  // Case Studies
  getCaseStudies: (query?: any) => api.get('/api/v1/case-studies', { params: query }),
  getCaseStudy: (id: string) => api.get(`/api/v1/case-studies/${id}`),
  createCaseStudy: (caseStudyData: any) => api.post('/api/v1/case-studies', caseStudyData),
  updateCaseStudy: (id: string, caseStudyData: any) => api.patch(`/api/v1/case-studies/${id}`, caseStudyData),
  deleteCaseStudy: (id: string) => api.delete(`/api/v1/case-studies/${id}`),
  
  // Press Releases
  getPressReleases: (query?: any) => api.get('/api/v1/press', { params: query }),
  getPressRelease: (id: string) => api.get(`/api/v1/press/${id}`),
  createPressRelease: (pressData: any) => api.post('/api/v1/press', pressData),
  updatePressRelease: (id: string, pressData: any) => api.patch(`/api/v1/press/${id}`, pressData),
  deletePressRelease: (id: string) => api.delete(`/api/v1/press/${id}`),
  
  // Careers
  getJobListings: (query?: any) => api.get('/api/v1/careers/jobs', { params: query }),
  getJobListing: (id: string) => api.get(`/api/v1/careers/jobs/${id}`),
  createJobListing: (jobData: any) => api.post('/api/v1/careers/jobs', jobData),
  updateJobListing: (id: string, jobData: any) => api.patch(`/api/v1/careers/jobs/${id}`, jobData),
  deleteJobListing: (id: string) => api.delete(`/api/v1/careers/jobs/${id}`),
  applyForJob: (jobId: string, applicationData: any) => api.post(`/api/v1/careers/jobs/${jobId}/apply`, applicationData),
  getJobApplications: (query?: any) => api.get('/api/v1/careers/applications', { params: query }),
};

// System API
export const systemApi = {
  getStatus: () => api.get('/api/v1/status'),
  getHealth: () => api.get('/health'),
  getServiceHealth: () => api.get('/api-docs/health'),
};

export default api;
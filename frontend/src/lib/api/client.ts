import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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


// System API
export const systemApi = {
  getStatus: () => api.get('/api/v1/system/status'),
  getHealth: () => api.get('/api/v1/system/health'),
  getIntegrations: () => api.get('/api/v1/system/integrations'),
  getIntegrationStatus: (id: string) => api.get(`/api/v1/system/integrations/${id}/status`),
  connectIntegration: (id: string, data: any) => api.post(`/api/v1/system/integrations/${id}/connect`, data),
  disconnectIntegration: (id: string) => api.delete(`/api/v1/system/integrations/${id}/disconnect`),
  getPrivacyPolicy: () => api.get('/api/v1/system/legal/privacy'),
  getTermsOfService: () => api.get('/api/v1/system/legal/terms'),
  getCookiePolicy: () => api.get('/api/v1/system/legal/cookies'),
  getGdprInfo: () => api.get('/api/v1/system/legal/gdpr'),
  getSecurityPolicy: () => api.get('/api/v1/system/legal/security'),
  getRefundPolicy: () => api.get('/api/v1/system/legal/refund'),
  getShippingPolicy: () => api.get('/api/v1/system/legal/shipping'),
  getAccessibilityStatement: () => api.get('/api/v1/system/legal/accessibility'),
  getMaintenanceStatus: () => api.get('/api/v1/system/maintenance'),
  getSystemSettings: () => api.get('/api/v1/system/settings'),
  updateSystemSettings: (settings: any) => api.put('/api/v1/system/settings', settings),
};

// Marketplace API
export const marketplaceApi = {
  getProducts: (query?: any) => api.get('/api/v1/marketplace/products', { params: query }),
  getProduct: (id: string) => api.get(`/api/v1/marketplace/products/${id}`),
  searchProducts: (searchData: any) => api.post('/api/v1/marketplace/search', searchData),
  getSearchSuggestions: (query: string) => api.get(`/api/v1/marketplace/search/suggestions?q=${query}`),
  getFeaturedProducts: (query?: any) => api.get('/api/v1/marketplace/featured', { params: query }),
  getTrendingProducts: (query?: any) => api.get('/api/v1/marketplace/trending', { params: query }),
  getCategories: () => api.get('/api/v1/marketplace/categories'),
  getCategoryProducts: (id: string, query?: any) => api.get(`/api/v1/marketplace/categories/${id}/products`, { params: query }),
  getFilters: (query?: any) => api.get('/api/v1/marketplace/filters', { params: query }),
  getProductReviews: (id: string, query?: any) => api.get(`/api/v1/marketplace/products/${id}/reviews`, { params: query }),
  addProductReview: (id: string, review: any) => api.post(`/api/v1/marketplace/products/${id}/reviews`, review),
  trackProductView: (id: string, data?: any) => api.post(`/api/v1/marketplace/products/${id}/track-view`, data),
  trackProductDownload: (id: string, data?: any) => api.post(`/api/v1/marketplace/products/${id}/track-download`, data),
  getVendors: (query?: any) => api.get('/api/v1/marketplace/vendors', { params: query }),
  getVendor: (id: string) => api.get(`/api/v1/marketplace/vendors/${id}`),
  getVendorProducts: (id: string, query?: any) => api.get(`/api/v1/marketplace/vendors/${id}/products`, { params: query }),
  getPopularProducts: (query?: any) => api.get('/api/v1/marketplace/analytics/popular', { params: query }),
  getRecentProducts: (query?: any) => api.get('/api/v1/marketplace/analytics/recent', { params: query }),
  getMarketplaceStats: () => api.get('/api/v1/marketplace/analytics/stats'),
};

// Cart API
export const cartApi = {
  getCart: () => api.get('/api/v1/cart'),
  addToCart: (data: any) => api.post('/api/v1/cart/items', data),
  updateCartItem: (itemId: string, data: any) => api.put(`/api/v1/cart/items/${itemId}`, data),
  removeFromCart: (itemId: string) => api.delete(`/api/v1/cart/items/${itemId}`),
  clearCart: () => api.delete('/api/v1/cart'),
  applyCoupon: (data: any) => api.post('/api/v1/cart/coupon', data),
  removeCoupon: () => api.delete('/api/v1/cart/coupon'),
  getCartSummary: () => api.get('/api/v1/cart/summary'),
  validateCart: () => api.post('/api/v1/cart/validate'),
  mergeCart: (data: any) => api.post('/api/v1/cart/merge', data),
  getCartCount: () => api.get('/api/v1/cart/count'),
};

// Checkout API
export const checkoutApi = {
  initiateCheckout: (data: any) => api.post('/api/v1/checkout/initiate', data),
  getCheckoutSession: (sessionId: string) => api.get(`/api/v1/checkout/session/${sessionId}`),
  createPaymentIntent: (data: any) => api.post('/api/v1/checkout/payment-intent', data),
  confirmPayment: (data: any) => api.post('/api/v1/checkout/payment/confirm', data),
  cancelPayment: (data: any) => api.post('/api/v1/checkout/payment/cancel', data),
  getShippingOptions: (query?: any) => api.get('/api/v1/checkout/shipping/options', { params: query }),
  calculateShipping: (data: any) => api.post('/api/v1/checkout/shipping/calculate', data),
  calculateTax: (query?: any) => api.get('/api/v1/checkout/tax/calculate', { params: query }),
  getPaymentMethods: () => api.get('/api/v1/checkout/payment-methods'),
  addPaymentMethod: (data: any) => api.post('/api/v1/checkout/payment-methods', data),
  getAddresses: () => api.get('/api/v1/checkout/addresses'),
  addAddress: (data: any) => api.post('/api/v1/checkout/addresses', data),
  updateAddress: (addressId: string, data: any) => api.put(`/api/v1/checkout/addresses/${addressId}`, data),
  validateCheckout: (data: any) => api.post('/api/v1/checkout/validate', data),
  completeCheckout: (data: any) => api.post('/api/v1/checkout/complete', data),
  getOrder: (orderId: string) => api.get(`/api/v1/checkout/orders/${orderId}`),
  cancelOrder: (orderId: string, data: any) => api.post(`/api/v1/checkout/orders/${orderId}/cancel`, data),
  requestRefund: (orderId: string, data: any) => api.post(`/api/v1/checkout/orders/${orderId}/refund`, data),
  handlePaymentSuccess: (sessionId: string) => api.get(`/api/v1/checkout/success/${sessionId}`),
  handlePaymentFailure: (sessionId: string) => api.get(`/api/v1/checkout/failure/${sessionId}`),
};

// Vendor API (updated)
export const vendorApi = {
  getProfile: () => api.get('/api/v1/vendor/profile'),
  updateProfile: (profileData: any) => api.put('/api/v1/vendor/profile', profileData),
  getProducts: (query?: any) => api.get('/api/v1/vendor/products', { params: query }),
  createProduct: (productData: any) => api.post('/api/v1/vendor/products', productData),
  updateProduct: (id: string, productData: any) => api.put(`/api/v1/vendor/products/${id}`, productData),
  deleteProduct: (id: string) => api.delete(`/api/v1/vendor/products/${id}`),
  getOrders: (query?: any) => api.get('/api/v1/vendor/orders', { params: query }),
  getOrder: (id: string) => api.get(`/api/v1/vendor/orders/${id}`),
  updateOrderStatus: (id: string, data: any) => api.put(`/api/v1/vendor/orders/${id}/status`, data),
  getAnalytics: (query?: any) => api.get('/api/v1/vendor/analytics', { params: query }),
  getPayouts: (query?: any) => api.get('/api/v1/vendor/payouts', { params: query }),
  requestPayout: (data: any) => api.post('/api/v1/vendor/payouts/request', data),
  getSettings: () => api.get('/api/v1/vendor/settings'),
  updateSettings: (settings: any) => api.put('/api/v1/vendor/settings', settings),
  submitKyc: (data: any) => api.post('/api/v1/vendor/kyc/submit', data),
  getKycStatus: () => api.get('/api/v1/vendor/kyc/status'),
};

// Content API (updated)
export const contentApi = {
  // Blog Management
  getBlogPosts: (query?: any) => api.get('/api/v1/content/blog/posts', { params: query }),
  getBlogPost: (slug: string) => api.get(`/api/v1/content/blog/posts/${slug}`),
  createBlogPost: (postData: any) => api.post('/api/v1/content/blog/posts', postData),
  updateBlogPost: (id: string, postData: any) => api.put(`/api/v1/content/blog/posts/${id}`, postData),
  deleteBlogPost: (id: string) => api.delete(`/api/v1/content/blog/posts/${id}`),
  
  // Help Center
  getHelpArticles: (query?: any) => api.get('/api/v1/content/help/articles', { params: query }),
  getHelpArticle: (id: string) => api.get(`/api/v1/content/help/articles/${id}`),
  getHelpCategories: () => api.get('/api/v1/content/help/categories'),
  createHelpArticle: (articleData: any) => api.post('/api/v1/content/help/articles', articleData),
  updateHelpArticle: (id: string, articleData: any) => api.put(`/api/v1/content/help/articles/${id}`, articleData),
  deleteHelpArticle: (id: string) => api.delete(`/api/v1/content/help/articles/${id}`),
  searchHelpArticles: (query: string) => api.get(`/api/v1/content/help/articles/search?q=${query}`),
  
  // Tutorials
  getTutorials: (query?: any) => api.get('/api/v1/content/tutorials', { params: query }),
  getTutorial: (id: string) => api.get(`/api/v1/content/tutorials/${id}`),
  createTutorial: (tutorialData: any) => api.post('/api/v1/content/tutorials', tutorialData),
  updateTutorial: (id: string, tutorialData: any) => api.put(`/api/v1/content/tutorials/${id}`, tutorialData),
  deleteTutorial: (id: string) => api.delete(`/api/v1/content/tutorials/${id}`),
  getTutorialCategories: () => api.get('/api/v1/content/tutorials/categories'),
  
  // Resources
  getResources: (query?: any) => api.get('/api/v1/content/resources', { params: query }),
  getResource: (id: string) => api.get(`/api/v1/content/resources/${id}`),
  createResource: (resourceData: any) => api.post('/api/v1/content/resources', resourceData),
  updateResource: (id: string, resourceData: any) => api.put(`/api/v1/content/resources/${id}`, resourceData),
  deleteResource: (id: string) => api.delete(`/api/v1/content/resources/${id}`),
  downloadResource: (id: string) => api.get(`/api/v1/content/resources/${id}/download`),
  
  // Case Studies
  getCaseStudies: (query?: any) => api.get('/api/v1/content/case-studies', { params: query }),
  getCaseStudy: (id: string) => api.get(`/api/v1/content/case-studies/${id}`),
  createCaseStudy: (caseStudyData: any) => api.post('/api/v1/content/case-studies', caseStudyData),
  updateCaseStudy: (id: string, caseStudyData: any) => api.put(`/api/v1/content/case-studies/${id}`, caseStudyData),
  deleteCaseStudy: (id: string) => api.delete(`/api/v1/content/case-studies/${id}`),
  
  // Press Releases
  getPressReleases: (query?: any) => api.get('/api/v1/content/press', { params: query }),
  getPressRelease: (id: string) => api.get(`/api/v1/content/press/${id}`),
  createPressRelease: (pressData: any) => api.post('/api/v1/content/press', pressData),
  updatePressRelease: (id: string, pressData: any) => api.put(`/api/v1/content/press/${id}`, pressData),
  deletePressRelease: (id: string) => api.delete(`/api/v1/content/press/${id}`),
  
  // Careers
  getJobListings: (query?: any) => api.get('/api/v1/content/careers/jobs', { params: query }),
  getJobListing: (id: string) => api.get(`/api/v1/content/careers/jobs/${id}`),
  createJobListing: (jobData: any) => api.post('/api/v1/content/careers/jobs', jobData),
  updateJobListing: (id: string, jobData: any) => api.put(`/api/v1/content/careers/jobs/${id}`, jobData),
  deleteJobListing: (id: string) => api.delete(`/api/v1/content/careers/jobs/${id}`),
  applyForJob: (jobId: string, applicationData: any) => api.post(`/api/v1/content/careers/jobs/${jobId}/apply`, applicationData),
  getJobApplications: (query?: any) => api.get('/api/v1/content/careers/applications', { params: query }),
};

export default api;
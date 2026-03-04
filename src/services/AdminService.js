import apiClient from './apiClient';

export const AdminService = {
  getDashboard: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getReports: async (queryParams = {}) => {
    try {
      const response = await apiClient.get('/admin/reports', { params: queryParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAnalytics: async (queryParams = {}) => {
    try {
      const response = await apiClient.get('/admin/analytics', { params: queryParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default AdminService;

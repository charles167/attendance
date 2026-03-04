import apiClient from './apiClient';

export const AttendanceService = {
  checkIn: async (attendanceData) => {
    try {
      const response = await apiClient.post('/attendance/check-in', attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  checkOut: async (attendanceData) => {
    try {
      const response = await apiClient.post('/attendance/check-out', attendanceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMyRecords: async (queryParams = {}) => {
    try {
      const response = await apiClient.get('/attendance/my-records', { params: queryParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserRecords: async (userId, queryParams = {}) => {
    try {
      const response = await apiClient.get(`/attendance/records/${userId}`, { params: queryParams });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default AttendanceService;

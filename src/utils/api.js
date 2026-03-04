// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REGISTER_WEBAUTHN: `${API_BASE_URL}/auth/register-webauthn`,
  GET_SESSION: `${API_BASE_URL}/auth/session`,

  // User endpoints
  REGISTER_USER: `${API_BASE_URL}/users/register`,
  GET_USER_PROFILE: `${API_BASE_URL}/users`,
  UPDATE_USER_PROFILE: `${API_BASE_URL}/users`,
  GET_ALL_USERS: `${API_BASE_URL}/users`,

  // Attendance endpoints
  CHECK_IN: `${API_BASE_URL}/attendance/check-in`,
  CHECK_OUT: `${API_BASE_URL}/attendance/check-out`,
  GET_MY_RECORDS: `${API_BASE_URL}/attendance/my-records`,
  GET_USER_RECORDS: `${API_BASE_URL}/attendance/records`,

  // Admin endpoints
  ADMIN_DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
  GET_REPORTS: `${API_BASE_URL}/admin/reports`,
  GET_ANALYTICS: `${API_BASE_URL}/admin/analytics`
};

export default API_ENDPOINTS;

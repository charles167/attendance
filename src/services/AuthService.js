import apiClient from './apiClient';

export const AuthService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('authToken');
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getSession: async () => {
    try {
      const response = await apiClient.get('/auth/session');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  registerWebAuthn: async (credential) => {
    try {
      const response = await apiClient.post('/auth/register-webauthn', credential);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default AuthService;

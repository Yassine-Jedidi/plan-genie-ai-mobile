import { apiRequest } from './config';

// Authentication API Service
export const authAPI = {
  signUp: async (email: string, password: string) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      data: { email, password, clientType: 'expo' },
    });
  },

  signIn: async (email: string, password: string) => {
    return apiRequest('/auth/signin', {
      method: 'POST',
      data: { email, password, clientType: 'expo' },
    });
  },

  signOut: async () => {
    return apiRequest('/auth/signout', { method: 'POST' });
  },

  resetPassword: async (email: string) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      data: { email, clientType: 'expo' },
    });
  },

  updatePassword: async (password: string, accessToken: string, refreshToken: string) => {
    return apiRequest('/auth/update-password', {
      method: 'POST',
      data: { password, accessToken, refreshToken },
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me', { method: 'GET' });
  },
};

export default authAPI;

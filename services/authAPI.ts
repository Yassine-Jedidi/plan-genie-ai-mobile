import { apiRequest } from './config';

// Authentication API Service
export const authAPI = {
  // Sign up with mobile bypass
  signUp: async (email: string, password: string) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      data: {
        email,
        password,
        clientType: 'expo', // This identifies the request as coming from mobile
        // No turnstileToken needed for mobile
      },
    });
  },

  // Sign in with mobile bypass
  signIn: async (email: string, password: string) => {
    return apiRequest('/auth/signin', {
      method: 'POST',
      data: {
        email,
        password,
        clientType: 'expo', // This identifies the request as coming from mobile
        // No turnstileToken needed for mobile
      },
    });
  },

  // Sign out
  signOut: async () => {
    return apiRequest('/auth/signout', {
      method: 'POST',
    });
  },

  // Reset password with mobile bypass
  resetPassword: async (email: string) => {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      data: {
        email,
        clientType: 'expo', // This identifies the request as coming from mobile
        // No turnstileToken needed for mobile
      },
    });
  },

  // Update password
  updatePassword: async (password: string, accessToken: string, refreshToken: string) => {
    return apiRequest('/auth/update-password', {
      method: 'POST',
      data: {
        password,
        accessToken,
        refreshToken,
      },
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return apiRequest('/auth/me', {
      method: 'GET',
    });
  },

  // Update profile
  updateNotifications: async (data: any) => {
    return apiRequest('/notifications/preferences', {
      method: 'PUT',
      data, // send as root, not { data }
    });
  },

  // Update theme
  updateTheme: async (theme: string, colorTheme: string) => {
    return apiRequest('/auth/update-theme', {
      method: 'PUT',
      data: { theme, colorTheme },
    });
  },
};

export default authAPI;

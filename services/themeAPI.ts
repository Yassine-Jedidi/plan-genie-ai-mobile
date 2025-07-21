import { apiRequest } from './config';

// Theme API Service
export const themeAPI = {
  updateTheme: async (theme: string, colorTheme: string) => {
    return apiRequest('/auth/update-theme', {
      method: 'PUT',
      data: { theme, colorTheme },
    });
  },
};

export default themeAPI; 
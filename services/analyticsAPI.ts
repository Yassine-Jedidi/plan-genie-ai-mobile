import { apiRequest } from './config';

// Analytics API Service
export const analyticsAPI = {
  getOverallAnalytics: async () => {
    return apiRequest('/analytics/overall', {
      method: 'GET',
    });
  },
};

export default analyticsAPI; 
import { apiRequest } from './config';

// Dashboard API Service
export const dashboardAPI = {
  getOverallDashboard: async () => {
    return apiRequest('/dashboard/overall', {
      method: 'GET',
    });
  },
};

export default dashboardAPI; 
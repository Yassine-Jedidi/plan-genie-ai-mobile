import { apiRequest } from './config';

// Notifications API Service
export const notificationsAPI = {
  updateNotifications: async (data: any) => {
    return apiRequest('/notifications/preferences', {
      method: 'PUT',
      data,
    });
  },
  getNotifications: async () => {
    return apiRequest('/notifications/preferences', {
      method: 'GET'
    });
  },
};

export default notificationsAPI; 
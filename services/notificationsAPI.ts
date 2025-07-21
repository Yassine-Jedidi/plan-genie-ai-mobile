import { apiRequest } from './config';

// Notifications API Service
export const notificationsAPI = {
  updateNotifications: async (data: any) => {
    return apiRequest('/notifications/preferences', {
      method: 'PUT',
      data,
    });
  },
};

export default notificationsAPI; 
import { apiRequest } from './config';

// Bilan API Service
export const bilanAPI = {
  getTodayBilan: async () => {
    return apiRequest('/bilan/today', {
      method: 'GET',
    });
  },
  getBilanByDate: async (date: string) => {
    return apiRequest(`/bilan/date/${date}`, {
      method: 'GET',
    });
  },
  getRecentBilans: async (limit: number = 7) => {
    return apiRequest(`/bilan/recent?limit=${limit}`, {
      method: 'GET',
    });
  },
  addOrUpdateBilanEntry: async (bilanId: string, taskId: string, minutesSpent: number, notes?: string) => {
    return apiRequest('/bilan/entry', {
      method: 'POST',
      data: { bilanId, taskId, minutesSpent, notes },
    });
  },
  deleteBilanEntry: async (entryId: string) => {
    return apiRequest(`/bilan/entry/${entryId}`, {
      method: 'DELETE',
    });
  },
};

export default bilanAPI; 
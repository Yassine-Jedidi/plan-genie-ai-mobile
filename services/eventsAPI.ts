import { apiRequest } from './config';

// Events API Service
export const eventsAPI = {
  saveEvent: async (type: string, entities: any) => {
    return apiRequest('/events/save', {
      method: 'POST',
      data: { type, entities },
    });
  },
  getEvents: async (userId: string) => {
    return apiRequest(`/events/${userId}`, {
      method: 'GET',
    });
  },
  saveManualEvent: async (title: string, date_time: string) => {
    return apiRequest('/events/manual', {
      method: 'POST',
      data: { title, date_time },
    });
  },
  updateEvent: async (eventId: string, title: string, date_time: string) => {
    return apiRequest(`/events/${eventId}`, {
      method: 'PUT',
      data: { title, date_time },
    });
  },
  deleteEvent: async (eventId: string) => {
    return apiRequest(`/events/${eventId}`, {
      method: 'DELETE',
    });
  },
};

export default eventsAPI; 
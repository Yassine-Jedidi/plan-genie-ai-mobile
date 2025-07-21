import { apiRequest } from './config';

// Tasks API Service
export const tasksAPI = {
  saveTask: async (type: string, entities: any) => {
    return apiRequest('/tasks/save', {
      method: 'POST',
      data: { type, entities },
    });
  },
  getTasks: async () => {
    return apiRequest('/tasks', {
      method: 'GET',
    });
  },
  updateTask: async (taskId: string, taskData: any) => {
    return apiRequest(`/tasks/${taskId}`, {
      method: 'PUT',
      data: taskData,
    });
  },
  deleteTask: async (taskId: string) => {
    return apiRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
};

export default tasksAPI; 
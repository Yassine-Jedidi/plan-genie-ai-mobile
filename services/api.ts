// API Configuration
const API_BASE_URL = 'https://plan-genie-ai-backend.vercel.app';

// Custom headers for mobile requests
const getMobileHeaders = () => ({
  'Content-Type': 'application/json',
  'User-Agent': 'Plan-Genie-Mobile-App/1.0 (Expo)',
});

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    ...options,
    credentials: 'include', // Include cookies in requests
    headers: {
      ...getMobileHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Generic file upload request function
const fileUploadRequest = async (endpoint: string, file: any, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const formData = new FormData();
  formData.append('file', file);

  const defaultOptions: RequestInit = {
    ...options,
    method: 'POST',
    credentials: 'include', // Include cookies in requests
    headers: {
      'User-Agent': 'Plan-Genie-Mobile-App/1.0 (Expo)',
      ...options.headers,
    },
    body: formData,
  };

  try {
    const response = await fetch(url, defaultOptions);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('File Upload Error:', error);
    throw error;
  }
};

// FastAPI Proxy API Service
export const fastapiAPI = {
  analyzeText: async (text: string) => {
    return apiRequest('/api/analyze-text', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
  
  transcribeAudio: async (audioFile: any) => {
    return fileUploadRequest('/audio/transcribe', audioFile);
  },
};

// Tasks API Service
export const tasksAPI = {
  saveTask: async (type: string, entities: any) => {
    return apiRequest('/tasks/save', {
      method: 'POST',
      body: JSON.stringify({ type, entities }),
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
      body: JSON.stringify(taskData),
    });
  },
  deleteTask: async (taskId: string) => {
    return apiRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
};

// Events API Service
export const eventsAPI = {
  saveEvent: async (type: string, entities: any) => {
    return apiRequest('/events/save', {
      method: 'POST',
      body: JSON.stringify({ type, entities }),
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
      body: JSON.stringify({ title, date_time }),
    });
  },
  updateEvent: async (eventId: string, title: string, date_time: string) => {
    return apiRequest(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify({ title, date_time }),
    });
  },
  deleteEvent: async (eventId: string) => {
    return apiRequest(`/events/${eventId}`, {
      method: 'DELETE',
    });
  },
}; 
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

// FastAPI Proxy API Service
export const fastapiAPI = {
  analyzeText: async (text: string) => {
    return apiRequest('/api/analyze-text', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
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
};

// Events API Service
export const eventsAPI = {
  saveEvent: async (type: string, entities: any) => {
    return apiRequest('/events/save', {
      method: 'POST',
      body: JSON.stringify({ type, entities }),
    });
  },
}; 
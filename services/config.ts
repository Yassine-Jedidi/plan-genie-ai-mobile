import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
export const API_BASE_URL = 'https://plan-genie-ai-backend.vercel.app';

// Create axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'Plan-Genie-Mobile-App/1.0 (Expo)',
  },
});

// Custom headers for mobile requests
export const getMobileHeaders = () => ({
  'Content-Type': 'application/json',
  'User-Agent': 'Plan-Genie-Mobile-App/1.0 (Expo)',
});

// Generic API request function using axios
export const apiRequest = async (endpoint: string, options: AxiosRequestConfig = {}) => {
  try {
    const config: AxiosRequestConfig = {
      ...options,
      headers: {
        ...getMobileHeaders(),
        ...options.headers,
      },
    };

    const response: AxiosResponse = await axiosInstance(endpoint, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Request Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.message || `HTTP error! status: ${error.response?.status}`);
    }
    console.error('API Request Error:', error);
    throw error;
  }
};

// Generic file upload request function using axios
export const fileUploadRequest = async (endpoint: string, file: any, options: AxiosRequestConfig = {}) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      ...options,
      method: 'POST',
      headers: {
        'User-Agent': 'Plan-Genie-Mobile-App/1.0 (Expo)',
        ...options.headers,
      },
      data: formData,
    };

    const response: AxiosResponse = await axiosInstance(endpoint, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('File Upload Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.message || `HTTP error! status: ${error.response?.status}`);
    }
    console.error('File Upload Error:', error);
    throw error;
  }
}; 
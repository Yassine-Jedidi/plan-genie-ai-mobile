import { apiRequest, fileUploadRequest } from './config';

// FastAPI Proxy API Service
export const fastapiAPI = {
  analyzeText: async (text: string) => {
    return apiRequest('/api/analyze-text', {
      method: 'POST',
      data: { text },
    });
  },
  
  transcribeAudio: async (audioFile: any) => {
    return fileUploadRequest('/audio/transcribe', audioFile);
  },
};

export default fastapiAPI; 
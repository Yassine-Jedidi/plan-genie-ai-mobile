// Main API exports - importing all separated services
export { analyticsAPI } from './analyticsService';
export { bilanAPI } from './bilanService';
export { dashboardAPI } from './dashboardService';
export { eventsAPI } from './eventsAPIService';
export { fastapiAPI } from './fastapiService';
export { tasksAPI } from './tasksService';

// Re-export authAPI for convenience
export { authAPI } from './authAPI';

// Export shared configuration
export { API_BASE_URL, apiRequest, fileUploadRequest, getMobileHeaders } from './config';


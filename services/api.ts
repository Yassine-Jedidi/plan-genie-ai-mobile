// Main API exports - importing all separated services
export { analyticsAPI } from './analyticsAPI';
export { bilanAPI } from './bilanAPI';
export { dashboardAPI } from './dashboardAPI';
export { eventsAPI } from './eventsAPI';
export { fastapiAPI } from './fastapiAPI';
export { tasksAPI } from './tasksAPI';

// Re-export authAPI for convenience
export { authAPI } from './authAPI';

// Export shared configuration
export { API_BASE_URL, apiRequest, fileUploadRequest, getMobileHeaders } from './config';


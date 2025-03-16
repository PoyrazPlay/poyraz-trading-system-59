
import axios from 'axios';

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: 'http://54.221.81.212:5000', // Your API base URL
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens, etc.
apiClient.interceptors.request.use(
  (config) => {
    // You can add authentication headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    // You can add global error handling here
    return Promise.reject(error);
  }
);

// Function to update base URL if needed (useful for switching environments)
export const updateApiBaseUrl = (newBaseUrl: string) => {
  apiClient.defaults.baseURL = newBaseUrl;
};

// Export the instance to use in your components
export default apiClient;

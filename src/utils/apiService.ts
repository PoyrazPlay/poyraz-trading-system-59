
import axios from 'axios';

// Backend machine options
export type BackendMachine = {
  name: string;
  url: string;
  username: string;
};

export const backendMachines: BackendMachine[] = [
  { name: 'M124', url: 'http://44.202.58.76:5000', username: 'M124' },
  { name: 'M123', url: 'http://54.221.81.212:5000', username: 'M123' },
  { name: 'M122', url: 'http://54.164.171.217:5000', username: 'M122' },
  { name: 'M125', url: 'http://54.234.199.237:5000', username: 'M125' },
];

// Default to M124
const defaultMachine = backendMachines[0];

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: defaultMachine.url, // Default to M124
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use localStorage to persist selected machine across page reloads
export const getSelectedMachine = (): BackendMachine => {
  const storedMachine = localStorage.getItem('selectedBackendMachine');
  if (storedMachine) {
    try {
      return JSON.parse(storedMachine);
    } catch (e) {
      console.error('Failed to parse stored machine, using default');
      return defaultMachine;
    }
  }
  return defaultMachine;
};

// Initialize from localStorage or default
let currentMachine = getSelectedMachine();
apiClient.defaults.baseURL = currentMachine.url;

// Function to update selected machine
export const setSelectedMachine = (machine: BackendMachine) => {
  apiClient.defaults.baseURL = machine.url;
  localStorage.setItem('selectedBackendMachine', JSON.stringify(machine));
  currentMachine = machine;
};

// Get current selected machine
export const getCurrentMachine = (): BackendMachine => {
  return currentMachine;
};

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

// Export the instance to use in your components
export default apiClient;

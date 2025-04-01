import axios from 'axios';

// Create an Axios instance with the base URL
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use env variable or fallback to localhost
  timeout: 10000, // Timeout in ms
  headers: {
    'Content-Type': 'application/json',
  },
});
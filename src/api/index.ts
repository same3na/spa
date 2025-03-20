import axios from 'axios';

// Create an Axios instance with the base URL
export const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Use env variable or fallback to localhost
  timeout: 10000, // Timeout in ms
  headers: {
    'Content-Type': 'application/json',
  },
});

export const featuresApiClient = axios.create({
  baseURL: 'http://localhost:8881', // Use env variable or fallback to localhost
  timeout: 10000, // Timeout in ms
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})
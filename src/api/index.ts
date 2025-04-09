import axios from 'axios';

// Create an Axios instance with the base URL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Use env variable or fallback to localhost
  timeout: 10000, // Timeout in ms
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Remove token
//       localStorage.removeItem('token');
//     }

//     return Promise.reject(error);
//   }
// );

// Custom hook to setup interceptors
export const setupInterceptors = (setError: (msg: string) => void, setErrorStatus: (status:number) => void) => {
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      setErrorStatus(error.response.status)
      const msg = error.response?.data?.message || "Something went wrong";
      setError(msg);
      return Promise.reject(error);
    }
  );
};

export default apiClient
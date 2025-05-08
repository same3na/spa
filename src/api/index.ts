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
  const groupId = localStorage.getItem('group_id');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (groupId) {
    config.headers["X-Group-ID"] = groupId
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
export const setupInterceptors = (setError: (msg: string) => void, setErrorStatus: (status:number) => void, setErrorDetails: (details:{}) => void) => {
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      setErrorStatus(error.response.status)
      const msg = error.response?.data?.message || "Something went wrong";
      setError(msg);
      const details = error.response?.data?.details || {}
      const normalized_details:any = {};
      for (const key in details) {
        const newKey = key.charAt(0).toLowerCase() + key.slice(1);
        normalized_details[newKey] = details[key];
      }
      setErrorDetails(normalized_details)
      return Promise.reject(error);
    }
  );
};

export default apiClient
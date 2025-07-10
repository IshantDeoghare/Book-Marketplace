import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api', // Your backend API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  async (config) => {
    // We can't use the useAuth hook here as it's not a component.
    // We'll get the token from a reliable source. A common pattern is
    // to have AuthContext save the token to localStorage.
    // For now, we will add it manually where needed, but this setup is ready for it.
    
    // A more advanced way will be implemented when we use a state manager.
    // For now, this setup establishes the base.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
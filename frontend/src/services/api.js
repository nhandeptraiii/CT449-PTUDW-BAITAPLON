import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// export default apiClient;
// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
    export const login = async (credentials) => {
    try{
        const response = await api.post('/auth/login', credentials);
        return response;
    } catch (error) {
        console.error('Login error:', error);
    }
    return false
    };

    export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
    };
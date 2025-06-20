import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'https://beyt-personal.vercel.app/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request and response interceptors for logging
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.log({error});
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.log({error});
    return Promise.reject(error);
  },
);

export default api;

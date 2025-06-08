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
    console.log(
      '[AXIOS][REQUEST]',
      config.method?.toUpperCase(),
      config.url,
      config.data || config.params,
    );
    return config;
  },
  error => {
    console.log('[AXIOS][REQUEST][ERROR]', error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    console.log(
      '[AXIOS][RESPONSE]',
      response.config.url,
      response.status,
      response.data,
    );
    return response;
  },
  error => {
    if (error.response) {
      console.log(
        '[AXIOS][RESPONSE][ERROR]',
        error.response.config.url,
        error.response.status,
        error.response.data,
      );
    } else {
      console.log('[AXIOS][RESPONSE][ERROR]', error.message);
    }
    return Promise.reject(error);
  },
);

export default api;

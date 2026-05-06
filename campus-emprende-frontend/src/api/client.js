import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8080',
});

client.interceptors.request.use((config) => {
  if (!config.skipAuth) {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default client;

// src/services/apiAxios.js
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import { API_BASE_URL } from './ApiUrl';
import { isTokenExpired } from './TokenExpire';
const apiAxios = axios.create({
  baseURL: API_BASE_URL,
   timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header if token exists
apiAxios.interceptors.request.use((config) => {
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 Unauthorized responses
apiAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem('token');
    if (token && isTokenExpired(token)){

    }
    if (error.response?.status === 401) {
      const navigate = useNavigate();
      alert("Session is ended");
      localStorage.removeItem('token');
      navigate('/');
    }
    return Promise.reject(error);
  }
);

export default apiAxios;

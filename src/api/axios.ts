// src/api/axios.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ejemplo Senior: Interceptor para manejo de latencia/errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Aggressive Error Feedback:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
import axios from 'axios';
import Cookies from 'js-cookie';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) {
    const formattedToken = token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`;
    config.headers.Authorization = formattedToken;
  }
  return config;
});

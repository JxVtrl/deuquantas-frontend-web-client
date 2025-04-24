import axios from 'axios';
import Cookies from 'js-cookie';

const isDocker = process.env.NEXT_PUBLIC_DOCKER_ENV === 'true';
const baseURL = isDocker
  ? process.env.NEXT_PUBLIC_API_URL || 'http://backend:3010'
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3010';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
  },
  withCredentials: true,
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      const formattedToken = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;
      config.headers.Authorization = formattedToken;
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  },
);

// Interceptor para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Limpa o token e redireciona para o login em caso de erro 401
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

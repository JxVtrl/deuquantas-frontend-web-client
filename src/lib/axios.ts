import axios from 'axios';
import Cookies from 'js-cookie';

const isDocker = process.env.NEXT_PUBLIC_DOCKER_ENV === 'true';
const baseURL = isDocker
  ? process.env.NEXT_PUBLIC_API_URL || 'http://backend:3001'
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

console.log('Axios baseURL:', baseURL);

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para CORS
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    console.log('Request Config:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data,
    });

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
    console.log('Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    if (error.response?.status === 401) {
      // Limpa o token e redireciona para o login em caso de erro 401
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

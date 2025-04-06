import axios from 'axios';

import { Errors } from '../../src/utils/constants';

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_BASE_URL });

// Adiciona o token do localStorage aos headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@DeuQuantas:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const setDefaultHeaderToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const setErrorInterceptor = (callback: (message: string) => void) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 401 && message === Errors.InvalidOrExpiredJWT) {
        callback(message);
      }
      return Promise.reject(error);
    },
  );
};

export default api;

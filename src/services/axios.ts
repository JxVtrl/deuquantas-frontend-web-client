import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/', // Configuração base para todas as requisições
});

export default axiosInstance;

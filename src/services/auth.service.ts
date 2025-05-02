import { api } from '@/lib/axios';
import Cookies from 'js-cookie';
import { ErrorService } from './error.service';
import { User } from './api/types';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  num_celular: string;
  num_cpf: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface AuthApiResponse {
  token: string;
  user: User;
  success: boolean;
  message?: string;
}

export class AuthService {
  static async login(data: LoginData) {
    try {
      const response = await api.post<AuthApiResponse>('/auth/login', data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Erro ao fazer login');
      }

      // Salvar o token nos cookies
      Cookies.set('token', response.data.token);

      // Configurar o token no header das requisições
      this.setDefaultHeaderToken(response.data.token);

      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error) {
      console.error('Erro no login:', error);
      const errorMessage = ErrorService.handleError(
        error,
        'Erro ao fazer login. Verifique suas credenciais.',
      );
      throw new Error(errorMessage);
    }
  }

  static async register(data: RegisterData) {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Erro no registro:', error);
      const errorMessage = ErrorService.handleError(
        error,
        'Erro ao realizar o cadastro.',
      );
      throw new Error(errorMessage);
    }
  }

  static setDefaultHeaderToken(token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  logout(): void {
    Cookies.remove('token');
    delete api.defaults.headers.common['Authorization'];
  }
}

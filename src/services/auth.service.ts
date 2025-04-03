import { api } from '@/lib/axios';
import Cookies from 'js-cookie';
import { User } from '../../services/api/types';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  password: string;
  telefone: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UserResponse {
  id: string;
  email: string;
  nome: string;
  telefone?: string;
  isAdmin: boolean;
  isAtivo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    const { token } = response.data;

    // Salva o token nos cookies
    Cookies.set('auth_token', token, { expires: 7 }); // Expira em 7 dias

    // Configura o token para as próximas requisições
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      const { token } = response.data;

      // Salva o token nos cookies
      Cookies.set('auth_token', token, { expires: 7 }); // Expira em 7 dias

      // Configura o token para as próximas requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      return response.data;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  logout(): void {
    // Remove o token dos cookies
    Cookies.remove('auth_token');

    // Remove o token do header das requisições
    delete api.defaults.headers.common['Authorization'];
  }

  isAuthenticated(): boolean {
    return !!Cookies.get('auth_token');
  }
}

export const authService = new AuthService();

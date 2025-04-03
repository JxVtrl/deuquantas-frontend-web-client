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

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await api.get(`/usuarios/check-email/${email}`);
      return response.data.exists;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      throw error;
    }
  }

  async checkCPFExists(cpf: string): Promise<boolean> {
    try {
      const response = await api.get(`/usuarios/check-document/${cpf}`);
      return response.data.exists;
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      throw error;
    }
  }

  async checkPhoneExists(telefone: string): Promise<boolean> {
    try {
      const response = await api.get(`/usuarios/check-phone/${telefone}`);
      return response.data.exists;
    } catch (error) {
      console.error('Erro ao verificar telefone:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();

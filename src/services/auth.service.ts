import { api } from '@/lib/axios';
import Cookies from 'js-cookie';
import { User } from '../../services/api/types';
import axios from 'axios';

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

interface AuthApiResponse {
  access_token: string;
  user: User;
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
    try {
      const response = await api.post<AuthApiResponse>('/auth/login', {
        email: data.email.toLowerCase(),
        password: data.password,
      });
      const { access_token, user } = response.data;

      // Salva o token nos cookies
      Cookies.set('auth_token', access_token, { expires: 7 }); // Expira em 7 dias

      // Configura o token para as próximas requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return {
        user,
        token: access_token,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Email ou senha incorretos');
        }
      }
      throw error;
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthApiResponse>('/auth/register', {
        ...data,
        email: data.email.toLowerCase(),
      });
      const { access_token, user } = response.data;

      // Salva o token nos cookies
      Cookies.set('auth_token', access_token, { expires: 7 }); // Expira em 7 dias

      // Configura o token para as próximas requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      return {
        user,
        token: access_token,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error('Email já cadastrado');
        }
      }
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
      const response = await api.get(`/clientes/check-email/${email}`);
      return response.data.exists;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      throw error;
    }
  }

  async checkCPFExists(cpf: string): Promise<boolean> {
    try {
      const response = await api.get(`/clientes/check-document/${cpf}`);
      return response.data.exists;
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      throw error;
    }
  }

  async checkPhoneExists(telefone: string): Promise<boolean> {
    try {
      const response = await api.get(`/clientes/check-phone/${telefone}`);
      return response.data.exists;
    } catch (error) {
      console.error('Erro ao verificar telefone:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();

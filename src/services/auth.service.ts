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
  numCelular: string;
  numCpf: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
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
  isAdmin: boolean;
  isAtivo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthApiResponse>('/auth/login', {
        email: data.email.toLowerCase(),
        password: data.password,
      });
      const { access_token, user } = response.data;

      // Formata o token corretamente
      const formattedToken = access_token.startsWith('Bearer ')
        ? access_token
        : `Bearer ${access_token}`;
      const tokenWithoutBearer = formattedToken.replace('Bearer ', '');

      // Salva o token nos cookies
      Cookies.set('auth_token', tokenWithoutBearer, { expires: 7 }); // Expira em 7 dias

      // Configura o token para as próximas requisições
      api.defaults.headers.common['Authorization'] = formattedToken;

      return {
        user,
        token: tokenWithoutBearer,
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

  async register(data: RegisterData): Promise<void> {
    try {
      await api.post('/auth/register', {
        ...data,
        email: data.email.toLowerCase(),
      });
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

  async checkCPFExists(numCpf: string): Promise<boolean> {
    try {
      const response = await api.get(`/clientes/check-cpf/${numCpf}`);
      return response.data.exists;
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      throw error;
    }
  }

  async checkPhoneExists(numCelular: string): Promise<boolean> {
    try {
      const response = await api.get(`/clientes/check-phone/${numCelular}`);
      return response.data.exists;
    } catch (error) {
      console.error('Erro ao verificar número de celular:', error);
      throw error;
    }
  }

  async checkCNPJExists(numCnpj: string): Promise<boolean> {
    try {
      const response = await api.get(`/auth/check-cnpj/${numCnpj}`);
      return response.data.exists;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }

  async checkEstablishmentPhoneExists(numCelular: string): Promise<boolean> {
    try {
      const response = await api.get(
        `/estabelecimentos/check-phone/${numCelular}`,
      );
      return response.data.exists;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return false;
      }
      throw error;
    }
  }
}

export const authService = new AuthService();

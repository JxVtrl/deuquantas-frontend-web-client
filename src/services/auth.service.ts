import { api } from '@/lib/axios';
import Cookies from 'js-cookie';
import { User } from '../../services/api/types';
import axios from 'axios';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
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
  name: string;
  isAdmin: boolean;
  isAtivo: boolean;
  dataCriacao: string;
  dataAtualizacao: string;
}

export class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('=== INÍCIO DO PROCESSO DE LOGIN ===');
      console.log('Dados enviados para login:', {
        email: data.email.toLowerCase(),
        password: '[PROTEGIDO]',
      });

      const response = await api.post<AuthApiResponse>('/auth/login', {
        email: data.email.toLowerCase(),
        password: data.password,
      });

      console.log('Resposta do servidor:', {
        access_token: response.data.access_token
          ? '[TOKEN GERADO]'
          : 'não gerado',
        user: response.data.user,
      });

      const { access_token, user } = response.data;

      // Formata o token corretamente
      const formattedToken = access_token.startsWith('Bearer ')
        ? access_token
        : `Bearer ${access_token}`;
      const tokenWithoutBearer = formattedToken.replace('Bearer ', '');

      console.log('Token formatado:', {
        original: access_token ? '[TOKEN]' : 'não gerado',
        formatted: formattedToken ? '[TOKEN FORMATADO]' : 'não formatado',
        withoutBearer: tokenWithoutBearer ? '[TOKEN SEM BEARER]' : 'não gerado',
      });

      // Salva o token nos cookies
      Cookies.set('auth_token', tokenWithoutBearer, { expires: 7 }); // Expira em 7 dias
      console.log('Token salvo nos cookies');

      // Configura o token para as próximas requisições
      api.defaults.headers.common['Authorization'] = formattedToken;
      console.log('Token configurado no header das requisições');

      console.log('=== FIM DO PROCESSO DE LOGIN ===');

      return {
        user,
        token: tokenWithoutBearer,
      };
    } catch (error) {
      console.error('=== ERRO NO PROCESSO DE LOGIN ===', error);
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
      console.log('=== INÍCIO DO PROCESSO DE REGISTRO ===');
      console.log('Dados enviados para registro:', {
        ...data,
        email: data.email.toLowerCase(),
        password: '[PROTEGIDO]',
      });

      await api.post('/auth/register', {
        ...data,
        email: data.email.toLowerCase(),
      });

      console.log('Registro concluído com sucesso');
      console.log('=== FIM DO PROCESSO DE REGISTRO ===');
    } catch (error) {
      console.error('=== ERRO NO PROCESSO DE REGISTRO ===', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          throw new Error('Email já cadastrado');
        }
      }
      throw error;
    }
  }

  logout(): void {
    console.log('=== INÍCIO DO PROCESSO DE LOGOUT ===');
    // Remove o token dos cookies
    Cookies.remove('auth_token');
    console.log('Token removido dos cookies');

    // Remove o token do header das requisições
    delete api.defaults.headers.common['Authorization'];
    console.log('Token removido do header das requisições');
    console.log('=== FIM DO PROCESSO DE LOGOUT ===');
  }

  isAuthenticated(): boolean {
    const token = Cookies.get('auth_token');
    console.log('Verificando autenticação:', {
      tokenPresent: !!token,
      token: token ? '[TOKEN PRESENTE]' : 'não encontrado',
    });
    return !!token;
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

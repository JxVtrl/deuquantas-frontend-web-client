import { api } from '@/lib/axios';
import Cookies from 'js-cookie';
import { User } from '../../services/api/types';
import axios from 'axios';
import { ErrorService } from './error.service';

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

export interface RegisterEstablishmentData {
  name: string;
  email: string;
  password: string;
  numCnpj: string;
  numCelular: string;
  nomeEstab: string;
  razaoSocial: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  imgLogo?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

interface AuthApiResponse {
  token: string;
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

export interface CheckAccountResponse {
  hasClienteAccount: boolean;
  hasEstabelecimentoAccount: boolean;
}

export class AuthService {
  static async login(data: LoginData) {
    try {
      const response = await api.post('/auth/login', data);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data;
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

  static async registerEstablishment(data: RegisterEstablishmentData) {
    try {
      const response = await api.post('/auth/register-establishment', data);
      return response.data;
    } catch (error) {
      console.error('Erro no registro do estabelecimento:', error);
      const errorMessage = ErrorService.handleError(
        error,
        'Erro ao realizar o cadastro do estabelecimento.',
      );
      throw new Error(errorMessage);
    }
  }

  static async checkAccountType(email: string) {
    try {
      const response = await api.get(`/auth/check-account-type?email=${email}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar tipo de conta:', error);
      const errorMessage = ErrorService.handleError(
        error,
        'Erro ao verificar tipo de conta.',
      );
      throw new Error(errorMessage);
    }
  }

  static async checkCPFExists(cpf: string) {
    try {
      const response = await api.get(`/auth/check-cpf?cpf=${cpf}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      const errorMessage = ErrorService.handleError(
        error,
        'Erro ao verificar CPF.',
      );
      throw new Error(errorMessage);
    }
  }

  static async checkCNPJExists(cnpj: string) {
    try {
      const response = await api.get(`/auth/check-cnpj?cnpj=${cnpj}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar CNPJ:', error);
      const errorMessage = ErrorService.handleError(
        error,
        'Erro ao verificar CNPJ.',
      );
      throw new Error(errorMessage);
    }
  }

  static async checkPhoneExists(phone: string) {
    try {
      const response = await api.get(`/auth/check-phone?phone=${phone}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar telefone:', error);
      const errorMessage = ErrorService.handleError(
        error,
        'Erro ao verificar telefone.',
      );
      throw new Error(errorMessage);
    }
  }

  static async getUserData() {
    try {
      const response = await axios.get('/api/auth/user-data');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      const errorMessage = ErrorService.handleError(
        error,
        'Erro ao buscar dados do usuário.',
      );
      throw new Error(errorMessage);
    }
  }

  async getUserData(): Promise<AuthResponse> {
    try {
      console.log('=== BUSCANDO DADOS DO USUÁRIO ===');
      const response = await api.get<AuthApiResponse>('/auth/me');
      console.log('Dados do usuário obtidos:', response.data);
      return {
        user: response.data.user,
        token: Cookies.get('token') || '',
      };
    } catch (error) {
      console.error('=== ERRO AO BUSCAR DADOS DO USUÁRIO ===', error);
      throw error;
    }
  }

  logout(): void {
    console.log('=== INÍCIO DO PROCESSO DE LOGOUT ===');
    // Remove o token dos cookies
    Cookies.remove('token');
    console.log('Token removido dos cookies');

    // Remove o token do header das requisições
    delete api.defaults.headers.common['Authorization'];
    console.log('Token removido do header das requisições');
    console.log('=== FIM DO PROCESSO DE LOGOUT ===');
  }

  isAuthenticated(): boolean {
    const token = Cookies.get('token');
    console.log('Verificando autenticação:', {
      tokenPresent: !!token,
      token: token ? '[TOKEN PRESENTE]' : 'não encontrado',
    });
    return !!token;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await api.get(`/auth/check-email/${email}`);
      return response.data.exists;
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      throw error;
    }
  }

  async getUserDataByEmail(email: string): Promise<UserResponse> {
    try {
      console.log('=== BUSCANDO DADOS DO USUÁRIO POR EMAIL ===');
      const response = await api.get<UserResponse>(
        `/auth/user-by-email/${email}`,
      );
      console.log('Dados do usuário obtidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('=== ERRO AO BUSCAR DADOS DO USUÁRIO POR EMAIL ===', error);
      throw error;
    }
  }
}

export const authService = new AuthService();

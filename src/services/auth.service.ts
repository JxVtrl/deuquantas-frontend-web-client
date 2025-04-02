import axios from 'axios';

// Ajustando a URL da API para usar o proxy CORS
const API_URL = '/api/proxy';

// Removendo as configurações de CORS que não funcionam no cliente

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  nome: string;
  password: string;
  telefone?: string;
}

export interface AuthResponse {
  access_token: string;
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

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Adaptando os dados para o formato esperado pelo backend
      const loginData = {
        email: credentials.email,
        password: credentials.password,
      };

      const response = await axios.post(`${API_URL}/auth/login`, loginData);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  static async register(userData: RegisterData): Promise<UserResponse> {
    try {
      // Enviar os dados para o endpoint de registro real
      const registerData = {
        email: userData.email,
        nome: userData.nome,
        password: userData.password,
        telefone: userData.telefone || undefined,
      };

      const response = await axios.post(
        `${API_URL}/auth/register`,
        registerData,
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  }

  static setAuthToken(token: string): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  static getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  static removeAuthToken(): void {
    delete axios.defaults.headers.common['Authorization'];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

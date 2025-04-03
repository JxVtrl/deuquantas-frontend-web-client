import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import {
  AuthService,
  LoginCredentials,
  RegisterData,
} from '@/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { PermissionLevel, User } from '../../services/api/types';
import { setDefaultHeaderToken } from '../../services/api';
import { saveUserPreferences, viewUserPreferences } from '../../services/user';
import axios from 'axios';

export type AvailableLanguages = 'pt' | 'en';
export type AvailableThemes = 'dark' | 'light' | 'system';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  processLogin: (token: string) => void;
  storeUserPreferences: (
    theme: AvailableThemes,
    language: AvailableLanguages,
  ) => void;
  clearSession: () => void;
  getUserPreferences: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
AuthContext.displayName = 'AuthContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<AvailableThemes>('dark');
  const [language, setLanguage] = useState<AvailableLanguages>('pt');
  const router = useRouter();

  const processToken = useCallback(async (token: string) => {
    try {
      const decodedToken = jwtDecode<User>(token);
      setUser(decodedToken);
      AuthService.setAuthToken(token);
      setDefaultHeaderToken(token);
      return true;
    } catch (error) {
      console.error('Erro ao processar token:', error);
      AuthService.removeAuthToken();
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const token = AuthService.getAuthToken();
        console.log('Token recuperado:', token);

        if (token && mounted) {
          const success = await processToken(token);

          // Se estiver na página de auth e tiver token válido, redireciona para home
          if (success && router.pathname === '/auth') {
            console.log(
              'Token válido encontrado, redirecionando para /customer/home',
            );
            await router.replace('/customer/home');
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [router.pathname, processToken]);

  const isAdmin = user?.permission_level === PermissionLevel.Admin;

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await AuthService.login(credentials);
      const access_token = response?.access_token;

      if (!access_token || typeof access_token !== 'string') {
        throw new Error('Token inválido ou não fornecido pela API.');
      }

      AuthService.setAuthToken(access_token);
      const decodedToken = jwtDecode<User>(access_token);

      console.log('Token decodificado:', decodedToken);

      setUser(decodedToken);

      router.push('/customer/home');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      // Registrando o usuário no backend real
      await AuthService.register(userData);

      // Após o registro bem-sucedido, redirecionar para a página de login
      router.push('/login');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.removeAuthToken();
    setUser(null);
    router.push('/login');
  };

  const storeUserPreferences = (
    theme: AvailableThemes,
    language: AvailableLanguages,
  ) => {
    setTheme(theme);
    setLanguage(language);
  };

  const getUserPreferences = async () => {
    try {
      const userPreferences = await viewUserPreferences();
      storeUserPreferences(userPreferences.theme, userPreferences.language);
    } catch (err: unknown) {
      console.warn('Error getting user preferences.');
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        try {
          const userPreferences = await saveUserPreferences(theme, language);
          storeUserPreferences(userPreferences.theme, userPreferences.language);
        } catch {
          console.warn('Error saving user preferences.');
        }
      }
    }
  };

  const clearSession = () => {
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin,
        processLogin: async (token: string) => {
          if (typeof window === 'undefined') {
            // Evita que o código execute no lado do servidor
            return;
          }

          try {
            if (!token || typeof token !== 'string') {
              console.error('Token inválido recebido:', token);
              return;
            }

            // Definir uma interface para o token decodificado
            interface DecodedToken {
              sub: string;
              nome?: string;
              email?: string;
              isAdmin?: boolean;
              permission_level?: number;
              exp: number;
              iat: number;
            }

            const decodedToken = jwtDecode<DecodedToken>(token);
            console.log('Token decodificado:', decodedToken);

            // Mapear os campos do token para a interface User
            const user: User = {
              id: Number(decodedToken.sub),
              nome: decodedToken.nome || '',
              email: decodedToken.email || '',
              isAdmin: decodedToken.isAdmin || false,
              sub: decodedToken.sub || '',
              permission_level:
                decodedToken.permission_level ||
                (decodedToken.isAdmin
                  ? PermissionLevel.Admin
                  : PermissionLevel.Customer),
            };

            console.log('Usuário mapeado:', user);

            setDefaultHeaderToken(token);
            setUser(user);
            // Usar apenas o token auth_token
            AuthService.setAuthToken(token);

            await getUserPreferences();

            const pageBeforeLogin = router.query.state;
            if (pageBeforeLogin) {
              router.back();
            } else {
              router.replace('/customer/home');
            }
          } catch (error) {
            console.error('Erro durante o processamento do login:', error);
            setUser(null);
          }
        },
        storeUserPreferences,
        getUserPreferences,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

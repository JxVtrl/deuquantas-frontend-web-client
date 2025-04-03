import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import { RegisterData, authService, LoginData } from '@/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { setDefaultHeaderToken } from '../../services/api';
import { saveUserPreferences, viewUserPreferences } from '../../services/user';
import axios from 'axios';
import Cookies from 'js-cookie';
import { PermissionLevel, User } from '../../services/api/types';

export type AvailableLanguages = 'pt' | 'en';
export type AvailableThemes = 'dark' | 'light' | 'system';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<{ token: string }>;
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
      Cookies.set('auth_token', token);
      setDefaultHeaderToken(token);
      return true;
    } catch (error) {
      console.error('Erro ao processar token:', error);
      Cookies.remove('auth_token');
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const token = Cookies.get('auth_token');
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

  const login = async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      setUser(response.user);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
      return { token: response.token };
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('auth_token');
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

            const decodedToken = jwtDecode<User>(token);
            console.log('Token decodificado:', decodedToken);

            setDefaultHeaderToken(token);
            setUser(decodedToken);
            Cookies.set('auth_token', token);

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

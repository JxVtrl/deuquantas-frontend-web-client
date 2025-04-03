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
  const router = useRouter();

  const processToken = useCallback(async (token: string) => {
    try {
      // Garante que o token começa com "Bearer "
      const formattedToken = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`;
      const decodedToken = jwtDecode<User>(
        formattedToken.replace('Bearer ', ''),
      );
      setUser(decodedToken);
      Cookies.set('auth_token', formattedToken.replace('Bearer ', ''));
      setDefaultHeaderToken(formattedToken);
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

        if (token && mounted) {
          const success = await processToken(token);

          // Se estiver na página de auth e tiver token válido, redireciona para home
          if (success && router.pathname === '/auth') {
            router.replace('/customer/home');
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
  const isAuthenticated = !!user;

  const login = async (data: LoginData) => {
    try {
      const response = await authService.login(data);
      await processToken(response.token);
      router.replace('/customer/home');
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      await processToken(response.token);
      return response;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('auth_token');
    setUser(null);
    setDefaultHeaderToken('');
    router.replace('/auth');
  };

  const storeUserPreferences = async (
    theme: AvailableThemes,
    language: AvailableLanguages,
  ) => {
    await saveUserPreferences(theme, language);
  };

  const getUserPreferences = async () => {
    try {
      await viewUserPreferences();
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  };

  const clearSession = () => {
    Cookies.remove('auth_token');
    setUser(null);
    setDefaultHeaderToken('');
  };

  const processLogin = async (token: string) => {
    await processToken(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
        processLogin,
        storeUserPreferences,
        clearSession,
        getUserPreferences,
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

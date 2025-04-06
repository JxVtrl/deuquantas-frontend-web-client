import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import { RegisterData, LoginData, AuthService } from '@/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { setDefaultHeaderToken } from '../../services/api';
import { saveUserPreferences, viewUserPreferences } from '../../services/user';
import Cookies from 'js-cookie';
import { User, UserJwt } from '../../services/api/types';
import { api } from '@/lib/axios';

export type AvailableLanguages = 'pt' | 'en';
export type AvailableThemes = 'dark' | 'light' | 'system';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCliente: boolean;
  isEstabelecimento: boolean;
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
      if (!token) {
        throw new Error('Token não fornecido');
      }

      // Remove "Bearer " se existir
      const cleanToken = token.replace('Bearer ', '');
      const decodedToken = jwtDecode<UserJwt>(cleanToken);

      // Salva o token no cookie
      Cookies.set('token', cleanToken, {
        expires: 7, // expira em 7 dias
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      // Define o token no cabeçalho padrão
      setDefaultHeaderToken(`Bearer ${cleanToken}`);

      let response;

      // Verificar se é cliente ou estabelecimento
      if (decodedToken.hasCliente) {
        try {
          const clienteResponse = await api.get(
            `/clientes/usuario/${decodedToken.sub}`,
          );
          response = clienteResponse.data;
        } catch {
          throw new Error('Erro ao buscar dados do cliente');
        }
      } else if (decodedToken.hasEstabelecimento) {
        try {
          try {
            response = await api.get(`/estabelecimentos/${decodedToken.sub}`);
          } catch {
            throw new Error('Erro ao buscar dados do estabelecimento');
          }
        } catch {
          throw new Error('Erro ao buscar dados do estabelecimento');
        }
      }

      console.log('response', JSON.stringify(response, null, 2));
      console.log('decodedToken', JSON.stringify(decodedToken, null, 2));

      // juntar os dados do decodedToken com os dados da response
      const usr = {
        endereco: {
          cep: response.cep,
          endereco: response.endereco,
          numero: response.numero,
          complemento: response.complemento,
          bairro: response.bairro,
          cidade: response.cidade,
          estado: response.estado,
        },
        usuario: {
          name: response.usuario.name,
          email: response.usuario.email,
          isAdmin: response.usuario.isAdmin,
          isAtivo: response.usuario.isAtivo,
          dataCriacao: response.usuario.dataCriacao,
          dataAtualizacao: response.usuario.dataAtualizacao,
          id: response.usuario.id,
          permission_level: decodedToken.permission_level,
        },
        cliente: {
          numCpf: response.numCpf,
          numCelular: response.numCelular,
          dataNascimento: response.dataNascimento,
        },
      };

      console.log('usr', usr);

      setUser(usr);
      return true;
    } catch {
      Cookies.remove('token');
      setUser(null);
      setDefaultHeaderToken('');
      return false;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const token = Cookies.get('token');

        if (token && mounted) {
          const success = await processToken(token);

          // Se estiver na página de auth e tiver token válido, redireciona para home
          if (success && router.pathname === '/auth') {
            if (user?.estabelecimento) {
              router.replace('/establishment/home');
            } else if (user?.cliente) {
              router.replace('/customer/home');
            } else {
              router.replace('/login');
            }
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

  const isAdmin = user?.usuario?.isAdmin ?? false;
  const isAuthenticated = !!user;

  const login = async (data: LoginData) => {
    try {
      const response = await AuthService.login(data);
      const token = response.token;
      if (!token) {
        throw new Error('Token não encontrado na resposta');
      }

      const success = await processToken(token);

      if (success) {
        // Redireciona com base no tipo de usuário
        if (user?.estabelecimento) {
          router.replace('/establishment/home');
        } else if (user?.cliente) {
          router.replace('/customer/home');
        } else {
          router.replace('/login');
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await AuthService.register(data);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setDefaultHeaderToken('');
    router.replace('/login');
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
    } catch {
      throw new Error('Erro ao carregar preferências');
    }
  };

  const clearSession = () => {
    Cookies.remove('token');
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
        isCliente: !!user?.cliente,
        isEstabelecimento: !!user?.estabelecimento,
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

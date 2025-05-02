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
import Cookies from 'js-cookie';
import { api } from '@/lib/axios';
import { User, UserJwt } from '@/services/api/types';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  clearSession: () => void;
  setUser: (user: User | null) => void;
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
      AuthService.setDefaultHeaderToken(`Bearer ${cleanToken}`);

      let response;

      // Verificar se é cliente ou estabelecimento
      if (decodedToken.hasCliente) {
        try {
          const res = await api.get(`/clientes/usuario/${decodedToken.sub}`);
          if (!res.data.success) {
            throw new Error('Erro ao buscar dados');
          }
          response = res.data.data;
        } catch (error) {
          console.error('Erro ao buscar dados:', error);
          throw new Error('Erro ao buscar dados');
        }
      } else if (decodedToken.hasEstabelecimento) {
        throw new Error('Usuário é estabelecimento');
      }

      if (!response) {
        throw new Error('Dados do usuário não encontrados');
      }

      const usr: User = {
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
          is_admin: response.usuario.is_admin,
          is_ativo: response.usuario.is_ativo,
          data_criacao: response.usuario.data_criacao,
          data_atualizacao: response.usuario.data_atualizacao,
          id: response.usuario.id,
          permission_level: decodedToken.permission_level || 1,
        },
        cliente: {
          id: response.id,
          num_cpf: response.num_cpf,
          num_celular: response.num_celular,
          data_nascimento: response.data_nascimento,
          avatar: `${process.env.NEXT_PUBLIC_API_URL}/uploads/${response.avatar}`,
        },
      };

      setUser(usr);
      return { success: true, user: usr };
    } catch (error) {
      console.error('Erro no processamento do token:', error);
      Cookies.remove('token');
      setUser(null);
      AuthService.setDefaultHeaderToken('');
      return { success: false, user: null };
    }
  }, []);

  const redirectTo = useCallback(
    (user: User | null) => {
      try {
        // Se não houver usuário, redireciona para login
        if (!user) {
          console.warn('Usuário não autenticado, redirecionando para login');
          router.replace('/login');
          return;
        }

        // Verifica se o usuário está ativo
        if (!user.usuario.is_ativo) {
          console.warn('Usuário inativo, redirecionando para login');
          router.replace('/login');
          return;
        }

        // Determina a rota baseada no tipo de usuário
        const route = !!user.cliente ? '/home' : '/login';

        // Verifica se a rota atual é diferente da rota de destino
        if (router.pathname !== route) {
          router.replace(route);
        }
      } catch (error) {
        console.error('Erro durante redirecionamento:', error);
        router.replace('/login');
      }
    },
    [router],
  );

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const token = Cookies.get('token');

        if (token && mounted) {
          const { success, user: processedUser } = await processToken(token);
          if (success && processedUser) {
            redirectTo(processedUser);
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
  }, [processToken]);

  const isAuthenticated = !!user;

  const login = async (data: LoginData) => {
    try {
      const response = await AuthService.login(data);
      const token = response.token;
      const { success, user: processedUser } = await processToken(token);
      if (success && processedUser) {
        redirectTo(processedUser);
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
    AuthService.setDefaultHeaderToken('');
  };

  const clearSession = () => {
    Cookies.remove('token');
    setUser(null);
    AuthService.setDefaultHeaderToken('');
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
        clearSession,
        setUser,
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

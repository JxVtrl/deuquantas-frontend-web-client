import { AuthService } from '@/services/auth.service';
import { useState } from 'react';

interface LoginFormData {
  email: string;
  senha: string;
}

interface RegisterFormData {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  confirmSenha: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  nome: string;
  email: string;
  password: string;
  telefone?: string;
}

interface UseAuthFormProps {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  onSuccess: () => void;
}

export function useAuthForm({ login, register, onSuccess }: UseAuthFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isRegisterAsEstablishment, setIsRegisterAsEstablishment] =
    useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: LoginFormData | RegisterFormData) => {
    setError('');

    // remove token dos cookies
    AuthService.removeAuthToken();

    if (!isLogin) {
      const registerData = data as RegisterFormData;
      if (registerData.senha !== registerData.confirmSenha) {
        setError('As senhas não coincidem.');
        return;
      }

      if (registerData.senha.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const loginData = data as LoginFormData;
        await login({
          email: loginData.email,
          password: loginData.senha,
        });
      } else {
        const registerData = data as RegisterFormData;
        await register({
          nome: registerData.nome,
          email: registerData.email,
          password: registerData.senha,
          telefone: registerData.telefone || undefined,
        });
      }
      onSuccess();
    } catch (err: unknown) {
      console.error('Erro:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(
          axiosError.response?.data?.message ||
            `Ocorreu um erro ao ${isLogin ? 'fazer login' : 'criar a conta'}.`,
        );
      } else {
        setError(
          `Ocorreu um erro ao ${isLogin ? 'fazer login' : 'criar a conta'}.`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin((prev) => !prev);

    setIsRegisterAsEstablishment(false);

    setError('');
  };

  const toggleRegisterAsEstablishment = () => {
    setIsRegisterAsEstablishment((prev) => !prev);
    setIsLogin(false);
    setError('');
  };

  return {
    isLogin,
    loading,
    error,
    handleSubmit,
    toggleForm,
    isRegisterAsEstablishment,
    setIsRegisterAsEstablishment,
    toggleRegisterAsEstablishment,
  };
}

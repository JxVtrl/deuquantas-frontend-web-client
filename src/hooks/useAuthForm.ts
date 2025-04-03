import { RegisterData, LoginData } from '@/services/auth.service';
import Cookies from 'js-cookie';
import { useState } from 'react';

interface LoginFormData {
  email: string;
  senha: string;
}

interface UseAuthFormProps {
  login: (credentials: LoginData) => Promise<void>;
  register: (credentials: RegisterData) => Promise<{ token: string }>;
  onSuccess: () => void;
}

export function useAuthForm({ login, register, onSuccess }: UseAuthFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isRegisterAsEstablishment, setIsRegisterAsEstablishment] =
    useState(false);

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
    setIsRegisterAsEstablishment(false);
    setError(null);
  };

  const toggleRegisterAsEstablishment = () => {
    setIsRegisterAsEstablishment((prev) => !prev);
    setIsLogin(false);
    setError(null);
  };

  const handleSubmit = async (data: LoginFormData | RegisterData) => {
    setLoading(true);
    setError(null);

    Cookies.remove('auth_token');

    try {
      if ('senha' in data) {
        await login({ email: data.email, password: data.senha });
      } else if ('nome' in data) {
        await register(data);
      }
      onSuccess();
    } catch {
      setError('Erro ao processar a requisição');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleSubmit,
    isLogin,
    isRegisterAsEstablishment,
    toggleForm,
    toggleRegisterAsEstablishment,
  };
}

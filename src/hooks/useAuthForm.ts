import { useState, FormEvent, ChangeEvent } from 'react';

interface AuthFormData {
  email: string;
  senha: string;
  nome: string;
  telefone: string;
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
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    senha: '',
    nome: '',
    telefone: '',
    confirmSenha: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  console.log('useAuthForm render - isLogin:', isLogin);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      if (formData.senha !== formData.confirmSenha) {
        setError('As senhas não coincidem.');
        return;
      }

      if (formData.senha.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.senha,
        });
      } else {
        await register({
          nome: formData.nome,
          email: formData.email,
          password: formData.senha,
          telefone: formData.telefone || undefined,
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
    console.log('toggleForm chamado no hook - estado atual:', isLogin);
    setIsLogin((prev) => {
      console.log('Alterando isLogin de', prev, 'para', !prev);
      return !prev;
    });
    setError('');
  };

  return {
    isLogin,
    formData,
    loading,
    error,
    handleInputChange,
    handleSubmit,
    toggleForm,
  };
}

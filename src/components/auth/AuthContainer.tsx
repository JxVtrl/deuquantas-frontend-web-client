import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import Image from 'next/image';
import AuthModal from './AuthModal';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

interface AuthContainerProps {
  loading: boolean;
  error?: string;
  formData: {
    email: string;
    senha: string;
    nome: string;
    telefone: string;
    confirmSenha: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AuthContainer({
  loading,
  error,
  formData,
  onInputChange,
  onSubmit,
}: AuthContainerProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const { isLogin, toggleForm } = useAuthForm({
    login,
    register,
    onSuccess: () => router.push('/dashboard'),
  });

  console.log('AuthContainer render - isLogin:', isLogin);

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#FFCC00] p-4'>
      <div className='w-[75vw] max-w-[314px] flex flex-col items-end'>
        <Image
          src='/brand/logo-dark.svg'
          alt='Logo'
          width={202}
          height={86}
          className='mb-[42px]'
        />

        <AnimatePresence mode='wait'>
          <AuthModal
            key={isLogin ? 'login' : 'register'}
            isLogin={isLogin}
            onToggleForm={toggleForm}
          >
            {isLogin ? (
              <LoginForm
                email={formData.email}
                senha={formData.senha}
                loading={loading}
                error={error}
                onInputChange={onInputChange}
                onSubmit={onSubmit}
              />
            ) : (
              <RegisterForm
                nome={formData.nome}
                email={formData.email}
                telefone={formData.telefone}
                senha={formData.senha}
                confirmSenha={formData.confirmSenha}
                loading={loading}
                error={error}
                onInputChange={onInputChange}
                onSubmit={onSubmit}
              />
            )}
          </AuthModal>
        </AnimatePresence>
      </div>
    </div>
  );
}

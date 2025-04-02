import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import Image from 'next/image';
import AuthModal from './AuthModal';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

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

interface AuthContainerProps {
  loading: boolean;
  error?: string;
  onSubmit: (data: LoginFormData | RegisterFormData) => void;
}

export function AuthContainer({
  loading,
  error,
  onSubmit,
}: AuthContainerProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const { isLogin, toggleForm } = useAuthForm({
    login,
    register,
    onSuccess: () => router.push('/dashboard'),
  });

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
                loading={loading}
                error={error}
                onSubmit={onSubmit as (data: LoginFormData) => void}
              />
            ) : (
              <RegisterForm
                loading={loading}
                error={error}
                onSubmit={onSubmit as (data: RegisterFormData) => void}
              />
            )}
          </AuthModal>
        </AnimatePresence>
      </div>
    </div>
  );
}

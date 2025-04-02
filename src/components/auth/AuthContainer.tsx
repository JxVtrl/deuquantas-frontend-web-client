import React, { useEffect } from 'react';
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
  isRegistered: boolean;
}

export function AuthContainer({
  loading,
  error,
  isRegistered,
}: AuthContainerProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const { isLogin, toggleForm, handleSubmit } = useAuthForm({
    login,
    register,
    onSuccess: () => router.push('/login'),
  });

  useEffect(() => {
    if (isRegistered) {
      toggleForm();
    }
  }, [isRegistered, toggleForm]);

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
                onSubmit={handleSubmit}
              />
            ) : (
              <RegisterForm
                loading={loading}
                error={error}
                onSubmit={handleSubmit}
              />
            )}
          </AuthModal>
        </AnimatePresence>
      </div>
    </div>
  );
}

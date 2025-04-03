import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import Image from 'next/image';
import AuthModal from '@/components/auth/AuthModal';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import RegisterEstablishmentForm from '@/components/auth/RegisterEstablishmentForm';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const { toggleForm, isLogin, isRegisterAsEstablishment } = useAuthForm({
    login,
    register,
    onSuccess: () => router.push('/customer/home'),
  });

  const isRegistered = router.query.register === 'true';

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
            key={
              isRegisterAsEstablishment
                ? 'register-establishment'
                : isLogin
                  ? 'login'
                  : 'register'
            }
          >
            {isRegisterAsEstablishment ? (
              <RegisterEstablishmentForm />
            ) : isLogin ? (
              <LoginForm />
            ) : (
              <RegisterForm />
            )}
          </AuthModal>
        </AnimatePresence>
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import AuthModal from '@/components/auth/AuthModal';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const {
    toggleForm,
    isLogin,
    isRegisterAsEstablishment,
    toggleRegisterAsEstablishment,
  } = useAuthForm({
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

  const backgroundColor = isRegisterAsEstablishment ? 'black' : '[#FFCC00]';
  const logoSrc = isRegisterAsEstablishment
    ? '/brand/logo.svg'
    : '/brand/logo-dark.svg';

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-${backgroundColor} p-4 transition-all duration-300`}
    >
      <div className='w-[75vw] max-w-[314px] flex flex-col items-end'>
        <Image
          src={logoSrc}
          alt='Logo'
          width={202}
          height={86}
          className='mb-[42px] transition-all duration-300'
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
            isLogin={isLogin}
            isRegisterAsEstablishment={isRegisterAsEstablishment}
            toggleForm={toggleForm}
            toggleRegisterAsEstablishment={toggleRegisterAsEstablishment}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

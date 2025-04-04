import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { LoginForm } from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { AuthFormProvider } from '@/contexts/AuthFormContext';
import { useAuthFormContext } from '@/contexts/AuthFormContext';

function AuthPageContent() {
  const { isLogin, isRegisterAsEstablishment } = useAuthFormContext();
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFCC00');
  const [logoSrc, setLogoSrc] = useState<string>('/brand/logo-dark.svg');

  useEffect(() => {
    console.log(
      'isRegisterAsEstablishment na página de auth:',
      isRegisterAsEstablishment,
    );
    setBackgroundColor(isRegisterAsEstablishment ? '#000000' : '#FFCC00');
    setLogoSrc(
      isRegisterAsEstablishment ? '/brand/logo.svg' : '/brand/logo-dark.svg',
    );
  }, [isRegisterAsEstablishment]);

  return (
    <div
      style={{ backgroundColor }}
      className='min-h-screen flex items-center justify-center p-4 transition-all duration-300'
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
          <motion.div
            key={isLogin ? 'login' : 'register'}
            initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: -90 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d' }}
            className='bg-[#F0F0F0] w-full rounded-lg shadow-[0px_1px_2px_0px_#0000000D] py-[20px] px-[24px] mx-auto h-fit'
          >
            {isLogin ? <LoginForm /> : <RegisterForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();

  return (
    <AuthFormProvider
      login={login}
      register={register}
      onSuccess={() => router.push('/customer/home')}
    >
      <AuthPageContent />
    </AuthFormProvider>
  );
}

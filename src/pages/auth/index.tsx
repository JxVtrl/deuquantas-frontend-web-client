import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { AuthFormProvider } from '@/contexts/AuthFormContext';
import { useAuthFormContext } from '@/contexts/AuthFormContext';
import { Logo } from '@deuquantas/components';

function AuthPageContent() {
  const { isLogin } = useAuthFormContext();

  return (
    <div
      style={{ backgroundColor: '#FFCC00' }}
      className='min-h-screen flex items-center justify-center p-4 transition-all duration-300'
    >
      <div className='w-[75vw] max-w-[314px] flex flex-col items-end gap-4'>
        <Logo variant={'dark'} size='large' />

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
  const { login, register } = useAuth();

  return (
    <AuthFormProvider login={login} register={register} onSuccess={() => null}>
      <AuthPageContent />
    </AuthFormProvider>
  );
}

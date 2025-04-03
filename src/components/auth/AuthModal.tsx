import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuthForm } from '@/hooks/useAuthForm';

interface AuthModalProps {
  children: React.ReactNode;
}

const AuthModal: React.FC<AuthModalProps> = ({ children }) => {
  const router = useRouter();
  const { login, register } = useAuth();
  const {
    toggleForm,
    isLogin,
    isRegisterAsEstablishment,
    setIsRegisterAsEstablishment,
  } = useAuthForm({
    login,
    register,
    onSuccess: () => router.push('/customer/home'),
  });

  const handleToggleClick = () => {
    toggleForm();
  };

  const handleRegisterAsEstablishment = () => {
    setIsRegisterAsEstablishment((prev) => !prev);
  };

  return (
    <motion.div
      key={
        isRegisterAsEstablishment
          ? 'register-establishment'
          : isLogin
            ? 'login'
            : 'register'
      }
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: -90 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{ transformStyle: 'preserve-3d' }}
      className='bg-[#F0F0F0] w-full rounded-lg shadow-[0px_1px_2px_0px_#0000000D] py-[20px] px-[24px] mx-auto h-fit'
    >
      {children}
      <div className='mt-[12px] text-end flex flex-col gap-[12px]'>
        <p className='text-[#272727] text-[12px] leading-[120%] font-[500]'>
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
          <span
            className='underline cursor-pointer font-[700]'
            onClick={handleToggleClick}
          >
            {isLogin ? 'Cadastrar' : 'Faça Login'}
          </span>
        </p>

        {!isLogin && (
          <p
            className='text-[#272727] text-[12px] leading-[120%] font-[700] underline cursor-pointer'
            onClick={handleRegisterAsEstablishment}
          >
            {isRegisterAsEstablishment
              ? 'Registrar como cliente'
              : 'Registrar como estabelecimento'}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default AuthModal;

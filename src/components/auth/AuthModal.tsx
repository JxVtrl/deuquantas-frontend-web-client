import { motion } from 'framer-motion';
import React from 'react';

interface AuthModalProps {
  children: React.ReactNode;
  isLogin: boolean;
  onToggleForm: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  children,
  isLogin,
  onToggleForm,
}) => {
  const handleToggleClick = () => {
    console.log('Botão clicado no AuthModal');
    console.log('Estado atual isLogin:', isLogin);
    onToggleForm();
  };

  return (
    <div className='w-full bg-white rounded-lg shadow-xl py-[20px] px-[24px]'>
      <motion.div
        key={isLogin ? 'login' : 'register'}
        initial={{ opacity: 0, rotateY: 180 }}
        animate={{ opacity: 1, rotateY: 0 }}
        exit={{ opacity: 0, rotateY: -180 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {children}
        <div className='mt-6 text-center'>
          <button
            onClick={handleToggleClick}
            className='text-yellow-600 hover:text-yellow-700 font-medium'
          >
            {isLogin
              ? 'Não tem uma conta? Registre-se'
              : 'Já tem uma conta? Faça login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;

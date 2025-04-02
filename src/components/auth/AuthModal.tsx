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
    <motion.div
      key={isLogin ? 'login' : 'register'}
      initial={{ opacity: 0, rotateY: 90, width: '0%' }}
      animate={{ opacity: 1, rotateY: 0, width: '100%' }}
      exit={{ opacity: 0, rotateY: -90, width: '0%' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className='bg-[#F0F0F0] rounded-lg shadow-xl py-[20px] px-[24px] mx-auto'
    >
      {children}
      <div className='mt-6 text-end '>
        <p>
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
          <span
            className='underline cursor-pointer'
            onClick={handleToggleClick}
          >
            {isLogin ? 'Cadastrar' : 'Faça Login'}
          </span>
        </p>
      </div>
    </motion.div>
  );
};

export default AuthModal;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import Image from 'next/image';
interface AuthContainerProps {
  isLogin: boolean;
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
  onToggleForm: () => void;
}

export function AuthContainer({
  isLogin,
  loading,
  error,
  formData,
  onInputChange,
  onSubmit,
  onToggleForm,
}: AuthContainerProps) {
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
          {isLogin ? (
            <motion.div
              key='login'
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -180 }}
              transition={{ duration: 0.5 }}
              className='w-full bg-white rounded-lg shadow-xl py-[20px] px-[24px]'
            >
              <LoginForm
                email={formData.email}
                senha={formData.senha}
                loading={loading}
                error={error}
                onInputChange={onInputChange}
                onSubmit={onSubmit}
              />
              <div className='mt-6 text-center'>
                <button
                  onClick={onToggleForm}
                  className='text-yellow-600 hover:text-yellow-700 font-medium'
                >
                  {isLogin
                    ? 'Não tem uma conta? Registre-se'
                    : 'Já tem uma conta? Faça login'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key='register'
              initial={{ opacity: 0, rotateY: 180 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -180 }}
              transition={{ duration: 0.5 }}
              className='w-full bg-white rounded-lg shadow-xl p-8'
            >
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
              <div className='mt-6 text-center'>
                <button
                  onClick={onToggleForm}
                  className='text-yellow-600 hover:text-yellow-700 font-medium'
                >
                  {isLogin
                    ? 'Já tem uma conta? Faça login'
                    : 'Não tem uma conta? Registre-se'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// pages/establishment/login.js
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function EstablishmentLogin() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='w-full max-w-md bg-white shadow-lg rounded-lg p-6'>
        <h1 className='text-2xl font-bold text-center'>
          {isRegister
            ? 'Cadastro do Estabelecimento'
            : 'Login do Estabelecimento'}
        </h1>
        <p className='text-gray-600 text-center mt-2'>
          {isRegister
            ? 'Preencha os campos abaixo para cadastrar seu estabelecimento.'
            : 'Acesse sua conta para gerenciar seu negócio.'}
        </p>

        {/* Formulário */}
        <form className='mt-6'>
          {isRegister && (
            <div className='mb-4'>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                Nome do Estabelecimento
              </label>
              <input
                type='text'
                id='name'
                name='name'
                placeholder='Nome do seu estabelecimento'
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              />
            </div>
          )}
          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              E-mail
            </label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Seu e-mail'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
          </div>
          <div className='mb-4'>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Senha
            </label>
            <input
              type='password'
              id='password'
              name='password'
              placeholder='Sua senha'
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
          </div>
          <Button type='submit' className='w-full'>
            {isRegister ? 'Cadastrar' : 'Entrar'}
          </Button>
        </form>

        {/* Alternar entre Login e Cadastro */}
        <div className='mt-4 text-center'>
          <p className='text-sm text-gray-600'>
            {isRegister ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className='text-indigo-600 font-medium hover:underline'
            >
              {isRegister ? 'Faça login' : 'Cadastre-se'}
            </button>
          </p>
        </div>

        {/* Link para o login do Cliente */}
        <div className='mt-4 text-center'>
          <p className='text-sm text-gray-600'>
            É um cliente?{' '}
            <Link
              href='/auth/login'
              className='text-indigo-600 font-medium hover:underline'
            >
              Acesse aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

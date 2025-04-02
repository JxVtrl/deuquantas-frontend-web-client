import React from 'react';

interface RegisterFormProps {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  confirmSenha: string;
  loading: boolean;
  error?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegisterForm({
  nome,
  email,
  telefone,
  senha,
  confirmSenha,
  loading,
  error,
  onInputChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit}>
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {error}
        </div>
      )}

      <div className='mb-4'>
        <label htmlFor='nome' className='block text-gray-700 mb-2'>
          Nome Completo
        </label>
        <input
          id='nome'
          type='text'
          value={nome}
          onChange={onInputChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
          required
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='email' className='block text-gray-700 mb-2'>
          Email
        </label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={onInputChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
          required
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='telefone' className='block text-gray-700 mb-2'>
          Telefone (opcional)
        </label>
        <input
          id='telefone'
          type='tel'
          value={telefone}
          onChange={onInputChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
        />
      </div>

      <div className='mb-4'>
        <label htmlFor='senha' className='block text-gray-700 mb-2'>
          Senha
        </label>
        <input
          id='senha'
          type='password'
          value={senha}
          onChange={onInputChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
          required
          minLength={6}
        />
      </div>

      <div className='mb-6'>
        <label htmlFor='confirmSenha' className='block text-gray-700 mb-2'>
          Confirmar Senha
        </label>
        <input
          id='confirmSenha'
          type='password'
          value={confirmSenha}
          onChange={onInputChange}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
          required
        />
      </div>

      <button
        type='submit'
        disabled={loading}
        className={`w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Registrando...' : 'Registrar'}
      </button>
    </form>
  );
}

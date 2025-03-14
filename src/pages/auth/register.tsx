import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações básicas
    if (senha !== confirmSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      await register({
        nome,
        email,
        senha,
        telefone: telefone || undefined,
      });
      // O redirecionamento é feito dentro da função register no AuthContext
    } catch (err: unknown) {
      console.error('Erro ao registrar:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(
          axiosError.response?.data?.message ||
            'Ocorreu um erro ao criar a conta.',
        );
      } else {
        setError('Ocorreu um erro ao criar a conta.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Criar Conta</h1>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='nome' className='block text-gray-700 mb-2'>
              Nome Completo
            </label>
            <input
              id='nome'
              type='text'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
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
              onChange={(e) => setEmail(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
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
              onChange={(e) => setTelefone(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
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
              onChange={(e) => setSenha(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
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
              onChange={(e) => setConfirmSenha(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <div className='mt-4 text-center'>
          <p>
            Já tem uma conta?{' '}
            <Link
              href='/auth/login'
              className='text-blue-500 hover:text-blue-700'
            >
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

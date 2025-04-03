import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [nome, setNome] = useState('');
  const [numCelular, setNumCelular] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setNome(user.nome || '');
      setNumCelular('');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const token = Cookies.get('auth_token');
      await axios.put(
        `${API_URL}/usuarios/${user?.id}`,
        { nome, numCelular },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setMessage('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-gray-100 py-12'>
        <div className='max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden'>
          <div className='bg-yellow-500 px-6 py-4'>
            <h1 className='text-white text-xl font-bold'>Meu Perfil</h1>
          </div>

          <div className='p-6'>
            {message && (
              <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
                {message}
              </div>
            )}

            {error && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label
                  htmlFor='email'
                  className='block text-gray-700 font-bold mb-2'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  value={user?.email || ''}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100'
                  disabled
                />
                <p className='text-sm text-gray-500 mt-1'>
                  O email não pode ser alterado
                </p>
              </div>

              <div className='mb-4'>
                <label
                  htmlFor='nome'
                  className='block text-gray-700 font-bold mb-2'
                >
                  Nome
                </label>
                <input
                  type='text'
                  id='nome'
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
                  required
                />
              </div>

              <div className='mb-6'>
                <label
                  htmlFor='numCelular'
                  className='block text-gray-700 font-bold mb-2'
                >
                  Número de celular
                </label>
                <input
                  type='tel'
                  id='numCelular'
                  value={numCelular}
                  onChange={(e) => setNumCelular(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500'
                />
              </div>

              <div className='flex justify-between'>
                <button
                  type='submit'
                  disabled={loading}
                  className='bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 disabled:opacity-50'
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>

                <button
                  type='button'
                  onClick={logout}
                  className='bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50'
                >
                  Sair
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;

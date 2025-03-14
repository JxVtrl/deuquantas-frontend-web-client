import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function CustomerHome() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className='min-h-screen bg-gray-100 p-6'>
        <div className='max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8'>
          <div className='flex justify-between items-center mb-8'>
            <h1 className='text-2xl font-bold'>
              Bem-vindo, {user?.name || 'Cliente'}
            </h1>
            <button
              onClick={logout}
              className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md'
            >
              Sair
            </button>
          </div>

          <div className='bg-blue-50 p-6 rounded-lg mb-6'>
            <h2 className='text-xl font-semibold mb-4'>Seu Perfil</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='text-gray-600'>Nome:</p>
                <p className='font-medium'>{user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className='text-gray-600'>Email:</p>
                <p className='font-medium'>{user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className='bg-gray-50 p-6 rounded-lg'>
            <h2 className='text-xl font-semibold mb-4'>Ações Rápidas</h2>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <button className='bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg'>
                Ver Histórico
              </button>
              <button className='bg-green-500 hover:bg-green-600 text-white p-4 rounded-lg'>
                Nova Transação
              </button>
              <button className='bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg'>
                Configurações
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

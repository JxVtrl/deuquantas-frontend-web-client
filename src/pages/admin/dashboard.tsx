import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute adminOnly>
      <div className='min-h-screen bg-gray-100 p-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='bg-white rounded-lg shadow-md p-8 mb-6'>
            <div className='flex justify-between items-center mb-8'>
              <h1 className='text-2xl font-bold'>Painel de Administração</h1>
              <div className='flex items-center gap-4'>
                <span className='text-gray-600'>
                  Olá, {user?.name || 'Admin'}
                </span>
                <button
                  onClick={logout}
                  className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md'
                >
                  Sair
                </button>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              <div className='bg-blue-50 p-6 rounded-lg'>
                <h3 className='text-lg font-semibold mb-2'>Usuários</h3>
                <p className='text-3xl font-bold'>1,234</p>
                <p className='text-green-500 mt-2'>+12% esta semana</p>
              </div>
              <div className='bg-green-50 p-6 rounded-lg'>
                <h3 className='text-lg font-semibold mb-2'>Transações</h3>
                <p className='text-3xl font-bold'>5,678</p>
                <p className='text-green-500 mt-2'>+8% esta semana</p>
              </div>
              <div className='bg-purple-50 p-6 rounded-lg'>
                <h3 className='text-lg font-semibold mb-2'>Receita</h3>
                <p className='text-3xl font-bold'>R$ 12.345</p>
                <p className='text-green-500 mt-2'>+15% esta semana</p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='bg-white rounded-lg shadow-md p-8'>
              <h2 className='text-xl font-semibold mb-4'>
                Ações Administrativas
              </h2>
              <div className='space-y-4'>
                <button className='w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg'>
                  Gerenciar Usuários
                </button>
                <button className='w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg'>
                  Relatórios Financeiros
                </button>
                <button className='w-full bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-lg'>
                  Configurações do Sistema
                </button>
              </div>
            </div>

            <div className='bg-white rounded-lg shadow-md p-8'>
              <h2 className='text-xl font-semibold mb-4'>
                Atividades Recentes
              </h2>
              <div className='space-y-4'>
                <div className='border-b pb-3'>
                  <p className='font-medium'>Novo usuário registrado</p>
                  <p className='text-gray-500 text-sm'>Há 5 minutos</p>
                </div>
                <div className='border-b pb-3'>
                  <p className='font-medium'>Transação concluída</p>
                  <p className='text-gray-500 text-sm'>Há 15 minutos</p>
                </div>
                <div className='border-b pb-3'>
                  <p className='font-medium'>Relatório gerado</p>
                  <p className='text-gray-500 text-sm'>Há 30 minutos</p>
                </div>
                <div>
                  <p className='font-medium'>Sistema atualizado</p>
                  <p className='text-gray-500 text-sm'>Há 1 hora</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

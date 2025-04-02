import React from 'react';
import { MaxWidthLayout } from '@/layout';
import { useAuth } from '@/contexts/AuthContext';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Usuário';
  return (
    <MaxWidthLayout backgroundColor='#FFCC00'>
      <header className='px-4 py-2 flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <div className='text-2xl font-bold'>dQ?</div>
          <div className='flex items-center gap-2'>
            <div className='text-sm'>Bem-vindo</div>
            <div className='text-sm font-bold'>{firstName}</div>
          </div>
        </div>
        <button className='w-8 h-8 rounded-full bg-white flex items-center justify-center'>
          {firstName.charAt(0).toUpperCase()}
        </button>
      </header>
    </MaxWidthLayout>
  );
};

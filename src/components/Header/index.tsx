import React from 'react';
import { MaxWidthLayout } from '@/layout';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { capitalize } from '@/utils/formatters';
import HeaderMenu from '../HeaderMenu';
export const Header: React.FC = () => {
  const { user } = useAuth();
  const firstName = user?.name || 'Usuário';

  return (
    <MaxWidthLayout backgroundColor='#FFCC00'>
      <header className='py-[7px] flex justify-between items-center'>
        <div className='flex items-center gap-[12px]'>
          <Image
            src='/brand/logo-dark.svg'
            width={47}
            height={20}
            alt='Logo Deu Quantas?'
          />

          <Image
            src='/icons/line.svg'
            width={1}
            height={16}
            alt='Linha vertical'
            className='w-[1px] h-[16px]'
          />

          <div className='flex items-center gap-2'>
            <p className='text-[14px] text-black font-[300]'>
              Bem-vindo{' '}
              <strong className='font-[700]'>{capitalize(firstName)}</strong>
            </p>
          </div>
        </div>

        <HeaderMenu />
      </header>
    </MaxWidthLayout>
  );
};

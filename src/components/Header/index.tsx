import React from 'react';
import { MaxWidthLayout } from '@/layout';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { capitalize } from '@/utils/formatters';
import HeaderMenu from '../HeaderMenu';

type HeaderProps = {
  isEstablishment?: boolean;
};

export const Header: React.FC<HeaderProps> = ({ isEstablishment = false }) => {
  const { user } = useAuth();
  const firstName = user?.usuario?.name || 'Usuário';

  return (
    <MaxWidthLayout backgroundColor={isEstablishment ? '#000' : '#FFCC00'}>
      <header className='py-[7px] flex justify-between items-center'>
        <div className='flex items-center gap-[12px]'>
          <Image
            src={isEstablishment ? '/brand/logo.svg' : '/brand/logo-dark.svg'}
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
            <p
              className={`text-[14px] text-${isEstablishment ? 'white' : 'black'} font-[300]`}
            >
              Bem-vindo{' '}
              <strong className='font-[700]'>{capitalize(firstName)}</strong>
            </p>
          </div>
        </div>

        <HeaderMenu isEstablishment={isEstablishment} />
      </header>
    </MaxWidthLayout>
  );
};

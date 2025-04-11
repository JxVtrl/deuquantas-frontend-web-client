import React from 'react';
import { MaxWidthLayout } from '@/layout';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { capitalize } from '@/utils/formatters';
import HeaderMenu from '../HeaderMenu';
import Logo from '../Logo';
import { useRouter } from 'next/router';
import { useComanda } from '@/contexts/ComandaContext';
export const Header: React.FC = () => {
  const { user } = useAuth();
  const { estabelecimento } = useComanda();
  const firstName = user?.usuario?.name || 'Usuário';
  const router = useRouter();
  const isComandaPage = router.pathname.includes('/comanda');

  const welcomeMessage =
    isComandaPage && estabelecimento ? (
      <>
        Você está no{' '}
        <strong className='font-[700]'>{estabelecimento.nome_estab}</strong>
      </>
    ) : (
      <>
        Bem-vindo{' '}
        <strong className='font-[700]'>{capitalize(firstName)}</strong>
      </>
    );

  return (
    <MaxWidthLayout backgroundColor={'#FFCC00'}>
      <header className='py-[7px] flex justify-between items-center'>
        <div className='flex items-center gap-[12px]'>
          <Logo variant={'dark'} />

          <Image
            src='/icons/line.svg'
            width={1}
            height={16}
            alt='Linha vertical'
            className='w-[1px] h-[16px]'
          />

          <div className='flex items-center gap-2'>
            <p className={`text-[14px] text-black font-[300]`}>
              {welcomeMessage}
            </p>
          </div>
        </div>

        <HeaderMenu />
      </header>
    </MaxWidthLayout>
  );
};

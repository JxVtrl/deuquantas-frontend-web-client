import React from 'react';
import { HeadTitleProps } from './HeadTitle.interface';
import { useRouter } from 'next/router';

const HeadTitle: React.FC<HeadTitleProps> = ({ title = <></> }) => {
  const router = useRouter();
  const isHome = router.pathname === '/customer/home';

  const { mesa_id, clienteId } = router.query;

  const establishment_name = 'Bar do Cazé';

  return (
    <div className='px-[16px] mb-[24px]'>
      <h1
        className='text-[24px] font-[300] text-black
        leading-[30px] m-0'
      >
        {isHome ? (
          <>
            Bem-vindo ao
            <br />
            <span className='font-[700]'>DeuQuantas</span>
          </>
        ) : mesa_id && clienteId ? (
          <>
            Sua comanda
            <br />
            no <span className='font-[700]'>{establishment_name}</span>
          </>
        ) : (
          title
        )}
      </h1>
    </div>
  );
};

export default HeadTitle;

import { useComanda } from '@/contexts/ComandaContext';
import { Button, MaxWidthWrapper } from '@deuquantas/components';
import React from 'react';

export const ComandaList: React.FC = () => {
  const { comanda } = useComanda();

  const itens = comanda?.itens;

  return (
    <MaxWidthWrapper>
      <div className='flex justify-between  mb-[20px]'>
        <span className='text-[12px] font-[500] text-[#272727] leading-[12px]'>
          Pedidos
        </span>
        <Button
          variant='filter'
          text={
            <span className='text-[11px] font-[500] text-[#272727] leading-[11px]'>
              Filtrar
            </span>
          }
        />
      </div>

      {itens?.map((item) => (
        <div
          key={item.id}
          className='flex justify-between items-center border-t border-[#E0E0E0] py-[16px]'
        >
          <div className='flex items-center gap-[8px]'>
            <span className='text-[14px] font-[500] text-[#272727] leading-[14px]'>
              {item.nome}
            </span>
          </div>
          <div className='flex items-center gap-[8px]'>
            <span className='text-[14px] font-[500] text-[#272727] leading-[14px]'>
              {item.preco}
            </span>
          </div>
        </div>
      ))}
    </MaxWidthWrapper>
  );
};

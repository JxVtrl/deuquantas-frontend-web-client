import { useComanda } from '@/contexts/ComandaContext';
import { Avatar, Button, MaxWidthWrapper } from '@deuquantas/components';
import { currencyFormatter } from '@/utils/formatters';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const ComandaList: React.FC = () => {
  const { comanda } = useComanda();
  const { user } = useAuth();

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

      {itens?.map((item) => {
        return (
          <div
            key={item.id}
            className='flex justify-between items-center border-t border-[#E0E0E0] py-[16px]'
          >
            <div className='flex items-center gap-[8px]'>
              <span className='text-[14px] font-[500] text-[#272727] leading-[14px]'>
                {item.nome}
              </span>
            </div>
            <div className='flex items-center gap-[12px]'>
              <Avatar
                name={item?.cliente?.nome}
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.cliente.avatar}`}
                bgColor={
                  item.cliente.id === user?.cliente.id ? '#FFCC00' : 'muted'
                }
              />
              <span className='text-[14px] font-[500] text-[#272727] leading-[14px]'>
                {currencyFormatter(item.preco)}
              </span>
              <button className='cursor-pointer w-[16px] h-[16px] p-0 bg-[#F0F0F0] flex items-center justify-center rounded-[2px]'>
                <svg
                  width='11'
                  height='4'
                  viewBox='0 0 11 4'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M1.42122 0.666748C0.687891 0.666748 0.0878906 1.26675 0.0878906 2.00008C0.0878906 2.73341 0.687891 3.33341 1.42122 3.33341C2.15456 3.33341 2.75456 2.73341 2.75456 2.00008C2.75456 1.26675 2.15456 0.666748 1.42122 0.666748ZM9.42122 0.666748C8.68789 0.666748 8.08789 1.26675 8.08789 2.00008C8.08789 2.73341 8.68789 3.33341 9.42122 3.33341C10.1546 3.33341 10.7546 2.73341 10.7546 2.00008C10.7546 1.26675 10.1546 0.666748 9.42122 0.666748ZM5.42122 0.666748C4.68789 0.666748 4.08789 1.26675 4.08789 2.00008C4.08789 2.73341 4.68789 3.33341 5.42122 3.33341C6.15456 3.33341 6.75456 2.73341 6.75456 2.00008C6.75456 1.26675 6.15456 0.666748 5.42122 0.666748Z'
                    fill='black'
                  />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </MaxWidthWrapper>
  );
};

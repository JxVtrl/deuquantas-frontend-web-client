import { useComanda } from '@/contexts/ComandaContext';
import { Avatar, Button, MaxWidthWrapper } from '@deuquantas/components';
import { currencyFormatter } from '@/utils/formatters';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Item } from '@/services/menu.service';

export const ComandaList: React.FC = () => {
  const { comanda, setSelectedItem, clientes } = useComanda();
  const { user } = useAuth();

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

      {(comanda?.itens as Item[]).map((item) => {
        const isFromClientLogged = item.cliente?.id === user?.cliente?.id;
        const isFromClientOrigem =
          item.cliente_origem?.id === user?.cliente?.id;
        const isFromClientPaid =
          clientes?.find((cliente) => cliente.id === item.cliente?.id)
            ?.status === 'pago';

        if (item.status === 'dividido') {
          return null;
        }

        return (
          <div
            key={item.id}
            className='flex justify-between items-center border-t border-[#E0E0E0] py-[16px]'
          >
            <div className='flex items-center gap-[8px]'>
              <span
                className='text-[14px] font-[500] text-[#272727] leading-[14px] capitalize'
                style={{
                  textDecoration: isFromClientPaid ? 'line-through' : 'none',
                }}
              >
                {item.nome}
              </span>
            </div>
            <div className='flex items-center gap-[12px]'>
              {item.cliente_origem && (
                <>
                  <Avatar
                    name={item.cliente_origem?.nome || ''}
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.cliente_origem?.avatar}`}
                    bgColor={isFromClientOrigem ? '#FFCC00' : 'muted'}
                  />
                  <svg
                    width='17'
                    height='16'
                    viewBox='0 0 17 16'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M12.675 7L7.075 1.4L8.5 -6.99382e-07L16.5 8L8.5 16L7.075 14.6L12.675 9L0.500001 9L0.500001 7L12.675 7Z'
                      fill='#1D1B20'
                    />
                  </svg>
                </>
              )}
              <Avatar
                name={item.cliente?.nome || ''}
                src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.cliente?.avatar}`}
                bgColor={isFromClientLogged ? '#FFCC00' : 'muted'}
              />
              <span
                className='text-[14px] font-[500] text-[#272727] leading-[14px]'
                style={{
                  textDecoration: isFromClientPaid ? 'line-through' : 'none',
                }}
              >
                {currencyFormatter(item.preco)}
              </span>
              <button
                className='cursor-pointer w-[16px] h-[16px] p-0 bg-[#F0F0F0] flex items-center justify-center rounded-[2px]'
                onClick={() => setSelectedItem(item)}
              >
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

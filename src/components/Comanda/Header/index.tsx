import { useAuth } from '@/contexts/AuthContext';
import { useComanda } from '@/contexts/ComandaContext';
import { currencyFormatter } from '@/utils/formatters';
import { Avatar, MaxWidthWrapper } from '@deuquantas/components';
import React from 'react';

export const ComandaHeader: React.FC = () => {
  const { user } = useAuth();
  const { comanda, clientes } = useComanda();

  // Valor total do consumo do usuário
  const consumo_user =
    clientes?.find((cliente) => {
      return cliente.id === user?.cliente.id;
    })?.valor_total || 0;

  // Soma do valor já pago por todos
  const valorPagoTotal =
    clientes?.reduce((acc, cliente) => acc + (cliente.valor_pago || 0), 0) || 0;

  // Valor total da conta
  const valorTotal = (comanda?.conta?.valTotal || 0) - valorPagoTotal;

  return (
    <MaxWidthWrapper
      style={{
        paddingBlock: '20px',
      }}
      styleContent={{
        display: 'flex',
        justifyContent: 'space-between',
        paddingBlock: '10px',
      }}
    >
      <div>
        <h2 className='text-[16px] font-[500] mb-[8px]'>
          Mesa {comanda?.numMesa}
        </h2>
        <p className='text-[14px] font-[300]'>
          <span className='font-[500]'>Grupo</span> - {clientes?.length || 1}{' '}
          {clientes?.length === 1 ? 'pessoa' : 'pessoas'}
        </p>
        {clientes?.length && (
          <div className='flex items-center gap-[8px] mt-[12px]'>
            {clientes.length <= 4 ? (
              <>
                {clientes.map((cliente, index) => (
                  <div
                    key={index}
                    className={`rounded-full border border-[#FFCC00] ${cliente.status === 'pago' ? 'opacity-40' : ''}`}
                  >
                    <Avatar
                      name={cliente.nome}
                      bgColor={
                        cliente.id === user?.cliente?.id ? '#FFCC00' : 'muted'
                      }
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${cliente.avatar}`}
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                {clientes.slice(0, 4).map((cliente, index) => (
                  <div
                    key={index}
                    className={`rounded-full border border-[#FFCC00] ${cliente.status === 'pago' ? 'opacity-40' : ''}`}
                  >
                    <Avatar
                      name={cliente.nome}
                      bgColor={
                        cliente.id === user?.cliente.id ? '#FFCC00' : 'muted'
                      }
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${cliente.avatar}`}
                    />
                  </div>
                ))}
                <div className='relative w-[20px] h-[24px]'>
                  {clientes.slice(4, 8).map((cliente, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 rounded-full border border-[#FFCC00] w-[24px] h-[24px] ${cliente.status === 'pago' ? 'opacity-40' : ''}`}
                      style={{
                        left: index * 10,
                        zIndex: 1 - index,
                      }}
                    >
                      <Avatar
                        name={cliente.nome}
                        bgColor={
                          cliente.id === user?.cliente.id ? '#FFCC00' : 'muted'
                        }
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${cliente.avatar}`}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className='flex flex-col h-full items-end gap-[16px]'>
        <div className='flex flex-row items-start gap-[10px]'>
          <span className='text-[12px] leading-[12px] font-[700] text-[#27272799]'>
            TOTAL R$
          </span>
          <span className='text-[28px] leading-[28px] font-[700] text-[#27272799]'>
            {currencyFormatter(valorTotal, {
              noPrefix: true,
            })}
          </span>
        </div>
        {valorPagoTotal > 0 && (
          <div className='flex flex-row items-start gap-[10px]'>
            <span className='text-[10px] leading-[10px] font-[700] text-[#27272799]'>
              Valor total pago
            </span>
            <span className='text-[16px] leading-[16px] font-[700] text-[#27272799]'>
              {currencyFormatter(valorPagoTotal)}
            </span>
          </div>
        )}
        <div className='flex flex-row items-start gap-[10px]'>
          <span className='text-[10px] leading-[10px] font-[700] text-[#27272799]'>
            Meu consumo
          </span>
          <span className='text-[20px] leading-[20px] font-[700] text-[#27272799]'>
            {currencyFormatter(consumo_user)}
          </span>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

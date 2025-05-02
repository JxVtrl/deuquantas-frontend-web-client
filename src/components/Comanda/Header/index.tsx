import { useAuth } from '@/contexts/AuthContext';
import { useComanda } from '@/contexts/ComandaContext';
import { currencyFormatter } from '@/utils/formatters';
import { Avatar, MaxWidthWrapper } from '@deuquantas/components';
import React from 'react';

export const ComandaHeader: React.FC = () => {
  const { user } = useAuth();
  const { comanda } = useComanda();

  console.log('comanda', JSON.stringify(comanda, null, 2));

  if (!user) {
    return null;
  }

  const myself = comanda?.pessoas?.find((pessoa) => {
    return pessoa.id === user.usuario.id;
  });

  if (!myself) {
    return null;
  }

  const pessoas = comanda?.pessoas?.filter((pessoa) => {
    return pessoa.id !== user.usuario.id;
  });

  if (pessoas) {
    pessoas.unshift(myself);
  }

  const consumo_user =
    pessoas?.find((pessoa) => {
      return pessoa.id === user?.usuario.id;
    })?.valor_total_consumido || 0;

  // Soma do valor já pago por todos
  const valorPagoTotal =
    comanda?.pessoas?.reduce(
      (acc, pessoa) => acc + (pessoa.valor_pago || 0),
      0,
    ) || 0;

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
          <span className='font-[500]'>Grupo</span> - {pessoas?.length || 1}{' '}
          {pessoas?.length === 1 ? 'pessoa' : 'pessoas'}
        </p>
        {pessoas?.length && (
          <div className='flex items-center gap-[8px] mt-[12px]'>
            {pessoas.length <= 4 ? (
              <>
                {pessoas.map((pessoa, index) => (
                  <div
                    key={index}
                    className={`rounded-full outline outline-[#FFCC00] ${pessoa.status === 'pago' ? 'opacity-40' : ''}`}
                  >
                    <Avatar
                      name={pessoa.nome}
                      bgColor={
                        pessoa.id === user.usuario.id ? '#FFCC00' : 'muted'
                      }
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${pessoa.avatar}`}
                    />
                  </div>
                ))}
              </>
            ) : (
              <>
                {pessoas.slice(0, 4).map((pessoa, index) => (
                  <div
                    key={index}
                    className={`rounded-full outline outline-[#FFCC00] ${pessoa.status === 'pago' ? 'opacity-40' : ''}`}
                  >
                    <Avatar
                      name={pessoa.nome}
                      bgColor={
                        pessoa.id === user.usuario.id ? '#FFCC00' : 'muted'
                      }
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${pessoa.avatar}`}
                    />
                  </div>
                ))}
                <div className='relative w-[20px] h-[24px]'>
                  {pessoas.slice(4, 8).map((pessoa, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 rounded-full outline outline-[#FFCC00] w-[24px] h-[24px] ${pessoa.status === 'pago' ? 'opacity-40' : ''}`}
                      style={{
                        left: index * 10,
                        zIndex: 1 - index,
                      }}
                    >
                      <Avatar
                        name={pessoa.nome}
                        bgColor={
                          pessoa.id === user.usuario.id ? '#FFCC00' : 'muted'
                        }
                        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${pessoa.avatar}`}
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
            {currencyFormatter(comanda?.conta?.valTotal || 0, {
              noPrefix: true,
            })}
          </span>
        </div>
        <div className='flex flex-row items-start gap-[10px]'>
          <span className='text-[10px] leading-[10px] font-[700] text-[#27272799]'>
            Valor já pago
          </span>
          <span className='text-[16px] leading-[16px] font-[700] text-green-700'>
            {currencyFormatter(valorPagoTotal)}
          </span>
        </div>
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

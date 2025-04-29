import React from 'react';
import { currencyFormatter } from '@/utils/formatters';
import { useComanda } from '@/contexts/ComandaContext';
import { MaxWidthWrapper } from '@deuquantas/components';
import { useAuth } from '@/contexts/AuthContext';

export const ComandaValueChart: React.FC = () => {
  const { comanda } = useComanda();
  const { user } = useAuth();

  if (!comanda || !comanda.conta) {
    return null;
  }

  const consumo_user =
    comanda.pessoas?.find((pessoa) => {
      return pessoa.id === user?.usuario.id;
    })?.valor_total || 0;
  const limite_user = 250; // TODO: Verificar limite do usuario nas preferências
  const consumo_total = comanda.conta.valTotal;
  const percentage =
    consumo_total > 0 ? (consumo_user / consumo_total) * 100 : 0;

  return (
    <MaxWidthWrapper
      style={{
        paddingBottom: '20px',
      }}
      styleContent={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <div className='transform translate-x-[-15,00,%] sm:translate-x-0'>
        {/* Gráfico circular */}
        <svg
          width={(200 / 2 + 6) * 2}
          height={(200 / 2 + 6) * 2}
          className='transform -rotate-90'
        >
          {/* Círculo de fundo */}
          <circle
            cx={200 / 2 + 6}
            cy={200 / 2 + 6}
            r={200 / 2}
            fill='none'
            stroke='#F0F0F0'
            strokeWidth={6}
          />
          {/* Círculo de progresso */}
          <circle
            cx={200 / 2 + 6}
            cy={200 / 2 + 6}
            r={200 / 2}
            fill='none'
            stroke='#FFCC00'
            strokeWidth={6}
            strokeDasharray={2 * Math.PI * (200 / 2)}
            strokeDashoffset={
              2 * Math.PI * (200 / 2) -
              (percentage / 100) * (2 * Math.PI * (200 / 2))
            }
            strokeLinecap='round'
          />
        </svg>

        {/* Conteúdo central */}
        <div
          className='
     
      absolute inset-0 flex flex-col items-center justify-center h-full'
        >
          <div className='text-center'>
            <p className='text-[12px] text-[#272727]'>
              R$
              <br />
              Meu consumo
            </p>
            <p className='text-[40px] font-[700] leading-[40px] my-[8px]'>
              {currencyFormatter(consumo_user, {
                noPrefix: true,
              })}
            </p>
            <svg
              width='132'
              height='2'
              viewBox='0 0 132 2'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <line y1='1' x2='132' y2='1' stroke='black' strokeOpacity='0.1' />
            </svg>

            <p className='text-[10px] text-[#272727] font-[500] leading-[10px] my-[8px]'>
              Total
            </p>
            <p className='text-[28px] text-[#27272799] font-[700] leading-[32px]'>
              {currencyFormatter(consumo_total, {
                noPrefix: true,
              })}
            </p>
          </div>
        </div>
      </div>

      <div className='absolute top-0 right-0 flex flex-col gap-[10px]'>
        {/* Informações adicionais */}
        <div className=' bg-[#FFCC00] px-2 py-1 rounded-[4px] text-xs text-[#272727] font-[500]'>
          <span>Meu consumo: {percentage.toFixed(0)}%</span>
        </div>
        {limite_user && (
          <div className='bg-[#F0F0F0] px-2 py-1 rounded-[4px] text-xs text-[#272727] font-[500]'>
            <span>Meu Limite: {currencyFormatter(limite_user)}</span>
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  );
};

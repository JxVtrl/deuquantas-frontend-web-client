import React from 'react';
import { currencyFormatter } from '@/utils/formatters';
import { useComanda } from '@/contexts/ComandaContext';
import { MaxWidthLayout } from '@/layout';

export const ComandaValueChart: React.FC = () => {
  const { comanda } = useComanda();

  if (!comanda) {
    return null;
  }

  const consumo_user = 100;
  const limite_user = 250;
  const consumo_total = 250;
  const percentage = (consumo_user / consumo_total) * 100;

  return (
    <MaxWidthLayout classNameContent='relative flex flex-col items-center'>
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
      <div className='absolute inset-0 flex flex-col items-center justify-center'>
        <div className='text-center'>
          <p className='text-[12px] text-[#272727]'>
            R$
            <br />
            Meu consumo
          </p>
          <p className='text-[40px] font-[700]'>
            {currencyFormatter(consumo_user, {
              noPrefix: true,
            })}
          </p>
          <p className='text-[10px] text-[#272727] font-[500]'>Total</p>
          <p className='text-[28px] text-[#27272799] font-[700]'>
            {currencyFormatter(consumo_total)}
          </p>
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
    </MaxWidthLayout>
  );
};

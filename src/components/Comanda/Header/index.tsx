import { useComanda } from '@/contexts/ComandaContext';
import { Avatar, MaxWidthWrapper } from '@deuquantas/components';
import React from 'react';

export const ComandaHeader: React.FC = () => {
  const { comanda } = useComanda();

  const pessoas = comanda?.pessoas;

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
            {pessoas?.length <= 4 ? (
              <>
                {pessoas?.map((pessoa, index) => (
                  <div
                    key={index}
                    className='rounded-full outline outline-[#FFCC00]'
                  >
                    <Avatar name={pessoa.usuario.name || ''} />
                  </div>
                ))}
              </>
            ) : (
              <>
                {pessoas?.slice(0, 4).map((pessoa, index) => (
                  <div
                    key={index}
                    className='rounded-full outline outline-[#FFCC00]'
                  >
                    <Avatar name={pessoa.usuario.name || ''} />
                  </div>
                ))}
                <div className='relative w-[20px] h-[24px]'>
                  {pessoas?.slice(4, 8).map((pessoa, index) => (
                    <div
                      key={index}
                      className='absolute inset-0 rounded-full outline outline-[#FFCC00] w-[24px] h-[24px]'
                      style={{
                        left: index * 10,
                        zIndex: 1 - index,
                      }}
                    >
                      <Avatar name={pessoa.usuario.name || ''} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className='flex flex-col h-full items-end gap-[24px]'>
        <div className='flex flex-row items-start gap-[10px]'>
          <span className='text-[12px] leading-[12px] font-[700] text-[#27272799]'>
            TOTAL R$
          </span>
          <span className='text-[28px] leading-[28px] font-[700] text-[#27272799]'>
            {comanda?.conta?.valTotal}
          </span>
        </div>
        <div className='flex flex-row items-start gap-[10px]'>
          <span className='text-[10px] leading-[10px] font-[700] text-[#27272799]'>
            Meu consumo
          </span>
          <span className='text-[20px] leading-[20px] font-[700] text-[#27272799]'>
            {comanda?.conta?.valTotal}
          </span>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

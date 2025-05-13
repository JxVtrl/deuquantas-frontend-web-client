import { Button, MaxWidthWrapper } from '@deuquantas/components';
import React from 'react';
import { useComanda } from '@/contexts/ComandaContext';

export const ComandaNotifications: React.FC = () => {
  const { getNotificacoesComanda } = useComanda();
  const notificacoes = getNotificacoesComanda();

  return (
    <MaxWidthWrapper
      style={{
        paddingTop: '20px',
      }}
      styleContent={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {notificacoes.length > 0 && (
        <div className='flex flex-col gap-[8px]'>
          <p className='text-md font-[600] leading-[100%] text-[#000000]'>
            Notificações
          </p>
        </div>
      )}

      <div className='flex flex-col gap-[8px]'>
        {notificacoes.map((not) => {
          console.log(not);
          switch (not.type) {
            case 'split-item':
              return (
                <div
                  key={not.id}
                  className='bg-[#F0F0F0] backdrop-blur-[10px] shadow-[0px_4px_4px_0px_#00000040] border-radius-[10px] p-[10px] flex justify-between'
                >
                  <div className='flex flex-col gap-[4px]'>
                    <p className='text-sm font-[500] leading-[100%] text-[#27272799]'>
                      Divisão de item - de {not.origem}
                    </p>
                    <span>
                      <b>{not.item}</b>
                    </span>
                  </div>
                  <div className='grid grid-cols-2 gap-[4px] shrink-0'>
                    <Button
                      variant='notification_primary'
                      onClick={not.onAccept}
                      text={
                        <svg
                          width='11'
                          height='9'
                          viewBox='0 0 11 9'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M3.86665 8.99994L0.0666504 5.19994L1.01665 4.24994L3.86665 7.09994L9.98332 0.983276L10.9333 1.93328L3.86665 8.99994Z'
                            fill='#1D1B20'
                          />
                        </svg>
                      }
                    />
                    <Button
                      variant='notification_secondary'
                      onClick={not.onReject}
                      text={
                        <svg
                          width='11'
                          height='10'
                          viewBox='0 0 11 10'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M1.76671 9.66671L0.833374 8.73337L4.56671 5.00004L0.833374 1.26671L1.76671 0.333374L5.50004 4.06671L9.23337 0.333374L10.1667 1.26671L6.43337 5.00004L10.1667 8.73337L9.23337 9.66671L5.50004 5.93337L1.76671 9.66671Z'
                            fill='#1D1B20'
                          />
                        </svg>
                      }
                    />
                  </div>
                </div>
              );
            case 'transferencia-item':
              return (
                <div
                  key={not.id}
                  className='bg-[#F0F0F0] backdrop-blur-[10px] shadow-[0px_4px_4px_0px_#00000040] border-radius-[10px] p-[10px] flex justify-between'
                >
                  <div className='flex flex-col gap-[4px]'>
                    <p className='text-sm font-[500] leading-[100%] text-[#27272799]'>
                      Transferência de item - de {not.origem}
                    </p>
                    <span>
                      <b>{not.item}</b>
                    </span>
                  </div>
                  <div className='grid grid-cols-2 gap-[4px] shrink-0'>
                    <Button
                      variant='notification_primary'
                      onClick={not.onAccept}
                      text={
                        <svg
                          width='11'
                          height='9'
                          viewBox='0 0 11 9'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M3.86665 8.99994L0.0666504 5.19994L1.01665 4.24994L3.86665 7.09994L9.98332 0.983276L10.9333 1.93328L3.86665 8.99994Z'
                            fill='#1D1B20'
                          />
                        </svg>
                      }
                    />
                    <Button
                      variant='notification_secondary'
                      onClick={not.onReject}
                      text={
                        <svg
                          width='10'
                          height='10'
                          viewBox='0 0 10 10'
                          fill='none'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M1.26671 9.66659L0.333374 8.73325L4.06671 4.99992L0.333374 1.26659L1.26671 0.333252L5.00004 4.06659L8.73337 0.333252L9.66671 1.26659L5.93337 4.99992L9.66671 8.73325L8.73337 9.66659L5.00004 5.93325L1.26671 9.66659Z'
                            fill='#1D1B20'
                          />
                        </svg>
                      }
                    />
                  </div>
                </div>
              );
            // Preparado para outros tipos no futuro
            default:
              return null;
          }
        })}
      </div>
    </MaxWidthWrapper>
  );
};

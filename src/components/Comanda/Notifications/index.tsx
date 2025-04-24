import { Button, MaxWidthWrapper } from '@deuquantas/components';
import React from 'react';

type Notification = {
  type:
  | 'limit-warning'
  | 'limit-exceeded'
  | 'limit-reached'
  | 'order-pending'
  | 'order-transfer';
  title: string;
  quantity?: number;
  button_icon?: React.ReactNode;
};

export const ComandaNotifications: React.FC = () => {
  const notifications_data: Notification[] = [
    {
      type: 'limit-warning',
      title: 'Você está próximo do seu limite.',
      button_icon: (
        <svg
          width='13'
          height='12'
          viewBox='0 0 13 12'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M1.83333 10.6667H2.78333L9.3 4.15L8.35 3.2L1.83333 9.71667V10.6667ZM0.5 12V9.16667L9.3 0.383333C9.43333 0.261111 9.58056 0.166667 9.74167 0.1C9.90278 0.0333333 10.0722 0 10.25 0C10.4278 0 10.6 0.0333333 10.7667 0.1C10.9333 0.166667 11.0778 0.266667 11.2 0.4L12.1167 1.33333C12.25 1.45556 12.3472 1.6 12.4083 1.76667C12.4694 1.93333 12.5 2.1 12.5 2.26667C12.5 2.44444 12.4694 2.61389 12.4083 2.775C12.3472 2.93611 12.25 3.08333 12.1167 3.21667L3.33333 12H0.5ZM8.81667 3.68333L8.35 3.2L9.3 4.15L8.81667 3.68333Z'
            fill='#1D1B20'
          />
        </svg>
      ),
    },
    {
      type: 'order-transfer',
      title: 'Porção de Batata Frita',
    },
    {
      type: 'order-pending',
      title: 'Chopp Bhrama',
      quantity: 2,
    },
  ];

  const notification_heading = {
    'limit-warning': 'Controle de Limite',
    'order-transfer': 'Transferência de item - de {user.name}',
    'order-pending': 'Bar',
    'limit-exceeded': 'Limite Excedido',
    'limit-reached': 'Limite atingido',
  };

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
      <p className='text-md font-[600] leading-[100%] text-[#000000]'>
        Notificações
      </p>

      <div className='flex flex-col gap-[8px]'>
        {notifications_data.map((notification) => (
          <div
            key={notification.type}
            className='bg-[#F0F0F0] backdrop-blur-[10px] shadow-[0px_4px_4px_0px_#00000040] border-radius-[10px] p-[10px] flex justify-between'
          >
            <div className='flex flex-col gap-[4px]'>
              <p className='text-sm font-[500] leading-[100%] text-[#27272799]'>
                {notification_heading[notification.type]}
              </p>

              <p className='text-[14px] font-[500] leading-[20px] text-[#000]'>
                {notification.quantity && `${notification.quantity}x `}
                {notification.title}
              </p>
            </div>

            <div className='grid grid-cols-2 gap-[4px] shrink-0'>
              <Button
                variant='notification_primary'
                text={
                  notification.button_icon || (
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
                  )
                }
              />
              <Button
                variant='notification_secondary'
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
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

import React from 'react';
import {
  MaxWidthWrapper,
  Button,
  PeopleIcon,
  ReceiptIcon,
  DrinksIcon,
} from '@deuquantas/components';
import { useRouter } from 'next/router';
import { useComanda } from '@/contexts/ComandaContext';

export const ComandaButtons: React.FC = () => {
  const router = useRouter();

  const conta_buttons_navigation = [
    {
      href: `/conta/menu`,
      icon: <DrinksIcon />,
      title: 'Menu',
    },
    {
      href: `/conta/comanda`,
      icon: <ReceiptIcon />,
      title: 'Comanda',
    },
    {
      href: `/conta/clientes`,
      icon: <PeopleIcon />,
      title: 'Pessoas',
    },
  ];

  return (
    <MaxWidthWrapper>
      <div className='grid grid-cols-3 gap-[2px] w-full max-w-[500px] my-[20px] h-[48px]'>
        {conta_buttons_navigation.map((button, index) => {
          const isFirst = index === 0;
          const isLast = index === conta_buttons_navigation.length - 1;

          return (
            <Button
              key={button.href}
              variant='menu'
              style={{
                ...{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  justifyContent: 'center',
                  height: '48px',
                  borderColor: 'transparent',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  paddingBlock: 0,
                },
                ...(isFirst
                  ? {
                    borderTopLeftRadius: '12px',
                    borderBottomLeftRadius: '12px',
                    borderTopRightRadius: '0px',
                    borderBottomRightRadius: '0px',
                  }
                  : isLast
                    ? {
                      borderTopRightRadius: '12px',
                      borderBottomRightRadius: '12px',
                      borderTopLeftRadius: '0px',
                      borderBottomLeftRadius: '0px',
                    }
                    : {
                      borderTopLeftRadius: '0px',
                      borderBottomLeftRadius: '0px',
                      borderTopRightRadius: '0px',
                      borderBottomRightRadius: '0px',
                    }),
              }}
              icon={{
                src: button.icon,
                alt: button.title,
                width: 24,
                height: 24,
              }}
              text={button.title}
              onClick={() => {
                router.push(button.href);
              }}
            />
          );
        })}
      </div>
    </MaxWidthWrapper>
  );
};

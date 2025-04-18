import React from 'react';
import {
  MaxWidthWrapper,
  Button,
  ShoppingCartIcon,
} from '@deuquantas/components';

const ComandaButtons: React.FC = () => {
  const left_button_class = {
    borderRadius: 'rounded-l-md rounded-r-none',
  };
  const right_button_class = {
    borderRadius: 'rounded-r-md rounded-l-none',
  };
  const middle_button_class = {
    borderRadius: 'rounded-none',
  };
  const shared_button_class = {
    placeItems: 'center',
    flex: 'flex-row',
    items: 'items-center',
    gap: 'gap-[10px]',
    justify: 'justify-center',
    h: 'h-[48px]',
  };

  const conta_buttons_navigation = [
    {
      href: '/conta/comanda',
      icon: <ShoppingCartIcon />,
      title: 'Comanda',
    },
  ];

  return (
    <MaxWidthWrapper>
      <div className='grid grid-cols-3 gap-[2px] w-full max-w-[500px] my-[20px] h-[48px]'>
        {conta_buttons_navigation.map((button, index) => (
          <Button
            key={button.href}
            variant='menu'
            style={{
              ...shared_button_class,
              ...(index === 0
                ? left_button_class
                : index === conta_buttons_navigation.length - 1
                  ? right_button_class
                  : middle_button_class),
            }}
            icon={{
              src: button.icon,
              alt: button.title,
              width: 24,
              height: 24,
            }}
            text={button.title}
            href={button.href}
          />
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

export default ComandaButtons;

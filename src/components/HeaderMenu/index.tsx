import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Avatar from '../Avatar';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

const HeaderMenu: React.FC = () => {
  const { logout } = useAuth();

  const menu_items = [
    {
      label: 'Sair',
      onClick: () => {
        logout();
      },
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='flex items-center gap-2 p-0'>
        <Avatar />
        <div className='w-[16px] h-[16px] flex items-center justify-center relative '>
          <Image
            src='/icons/chevron-down.svg'
            alt='Chevron down'
            className='absolute top-0 left-0 p-[4px]'
            layout='fill'
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menu_items.map((item) => (
          <DropdownMenuItem
            key={item.label}
            onClick={item.onClick}
            className='cursor-pointer'
          >
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderMenu;

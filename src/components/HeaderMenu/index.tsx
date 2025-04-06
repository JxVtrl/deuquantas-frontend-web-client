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
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { IOSSwitch } from '@/components/ui/ios-switch';

type HeaderMenuProps = {
  isEstablishment?: boolean;
};

const HeaderMenu: React.FC<HeaderMenuProps> = ({ isEstablishment = false }) => {
  const { logout } = useAuth();
  const { preferences, toggleLeftHanded } = useUserPreferences();
  const { isLeftHanded } = preferences;

  const handleToggleLeftHanded = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Toggle left-handed:', e.target.checked);
    toggleLeftHanded();
  };

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
            src={
              isEstablishment
                ? '/icons/chevron-down-white.svg'
                : '/icons/chevron-down.svg'
            }
            alt='Chevron down'
            className='absolute top-0 left-0 p-[4px]'
            layout='fill'
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56'>
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className='px-2 py-1.5'>
          <IOSSwitch
            checked={isLeftHanded}
            onChange={handleToggleLeftHanded}
            label='Modo Canhoto'
            description='Posiciona o botão de adicionar à esquerda'
          />
        </div>

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

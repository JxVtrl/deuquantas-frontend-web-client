import React from 'react';
import { useRouter } from 'next/router';
import { PlusIcon } from '@/components/Icons';
import { MaxWidthLayout } from '@/layout';
import { useNavigation } from '@/hooks/useNavigation';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

export interface NavigationItem {
  icon: React.FC;
  label: string;
  href: string;
}

const NavigationItem: React.FC<NavigationItem & { isActive: boolean }> = ({
  icon: Icon,
  label,
  href,
  isActive,
}) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(href)}
      className={`flex flex-col items-center justify-center gap-[4px] cursor-pointer hover:opacity-80 ${
        isActive ? 'text-[#FFCC00]' : 'text-white'
      }`}
    >
      <div className='h-[32px] flex items-center justify-center'>
        <Icon />
      </div>
      <div className='text-[12px] leading-[16px] font-[600] tracking-[0.5px]'>
        {label}
      </div>
    </div>
  );
};

export const BottomNavigation: React.FC = ({}) => {
  const { bottomNavItems, handleAddClick } = useNavigation();
  const { preferences } = useUserPreferences();
  const { isLeftHanded } = preferences;

  const router = useRouter();

  // Renderiza os itens de navegação com o botão de adicionar no meio para canhotos
  const renderNavigationItems = () => {
    if (isLeftHanded) {
      // Para canhotos: Início, Conta, Botão de Adicionar, Favoritos
      return (
        <>
          <button
            onClick={handleAddClick}
            className='w-14 h-14 bg-[#FFCC00] rounded-full border-4 border-white outline outline-2 outline-black flex items-center justify-center -mt-[64px]'
          >
            <div className='text-black w-6 h-6'>
              <PlusIcon />
            </div>
          </button>
          <NavigationItem
            {...bottomNavItems[0]}
            isActive={router.pathname.includes(bottomNavItems[0].href)}
          />
          <NavigationItem
            {...bottomNavItems[1]}
            isActive={router.pathname.includes(bottomNavItems[1].href)}
          />
          <NavigationItem
            {...bottomNavItems[2]}
            isActive={router.pathname.includes(bottomNavItems[2].href)}
          />
        </>
      );
    } else {
      // Para destros: Início, Conta, Favoritos, Botão de Adicionar
      return (
        <>
          {bottomNavItems.map((item) => (
            <NavigationItem
              key={item.href}
              {...item}
              isActive={router.pathname.includes(item.href)}
            />
          ))}
          <button
            onClick={handleAddClick}
            className='w-14 h-14 bg-[#FFCC00] rounded-full border-4 border-white outline outline-2 outline-black flex items-center justify-center -mt-[64px]'
          >
            <div className='text-black w-6 h-6'>
              <PlusIcon />
            </div>
          </button>
        </>
      );
    }
  };

  return (
    <MaxWidthLayout
      backgroundColor='#272727'
      className='fixed bottom-0 left-0 right-0'
    >
      <div className='flex justify-around items-center h-[66px]'>
        {renderNavigationItems()}
      </div>
    </MaxWidthLayout>
  );
};

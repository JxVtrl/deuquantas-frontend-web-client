import { useAuth } from '@/contexts/AuthContext';
import { menu_items } from '@/data/menu';
import { useNavigation } from '@/hooks/useNavigation';
import {
  Header,
  Navigation,
  NavigationMenu,
  StatusBar,
} from '@deuquantas/components';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useComanda } from '@/contexts/ComandaContext';
import { CartEmptyError } from '@/components/CartEmptyError';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { bottomNavItems } = useNavigation();
  const { estabelecimento, handleAddClick, isNavigationButtonDisabled } =
    useComanda();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const [establishmentName, setEstablishmentName] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (router.pathname.includes('/conta')) {
      setEstablishmentName(estabelecimento?.nome_estab);
    } else {
      setEstablishmentName(undefined);
    }
  }, [router.pathname, estabelecimento]);

  return (
    <>
      <div className='flex flex-col h-screen fixed inset-0'>
        <div className='flex-none'>
          <StatusBar variant='client' />
          <Header
            name={!establishmentName ? user?.usuario?.name : establishmentName}
            variant='client'
            text_variant={!establishmentName ? 'welcome' : 'on-establishment'}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            onLogoClick={() => router.push('/home')}
          />
        </div>
        <div className='flex-1 overflow-y-auto relative'>
          <div className='absolute inset-0 overflow-y-auto'>
            {children}
            <CartEmptyError />
          </div>
        </div>
        <div className='flex-none'>
          <NavigationMenu
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            variant='client'
            menuItems={menu_items.map((item) => {
              if (item.href === '/sair') {
                return {
                  label: item.label,
                  onClick: () => {
                    logout();
                  },
                };
              }
              return {
                label: item.label,
                onClick: () => router.push(item.href),
              };
            })}
          />
          <Navigation
            items={bottomNavItems}
            onAddClick={handleAddClick}
            disableButton={isNavigationButtonDisabled}
          />
        </div>
      </div>
    </>
  );
}

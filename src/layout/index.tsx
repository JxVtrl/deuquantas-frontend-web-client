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
import { useCustomerContext } from '@/contexts/CustomerContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isSafari, menuOpen, setMenuOpen } = useCustomerContext();

  const { bottomNavItems } = useNavigation();
  const { estabelecimento, handleAddClick, isNavigationButtonDisabled } =
    useComanda();
  const { user, logout } = useAuth();
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
      <div className='flex flex-col h-screen fixed inset-0 overflow-hidden'>
        <div
          className='absolute inset-0 overflow-y-auto'
          style={{
            paddingBottom: isSafari ? '81px' : '0px',
          }}
        >
          <StatusBar variant='client' />
          <Header
            nome={user?.usuario?.name}
            avatar={user?.cliente?.avatar}
            nome_estab={establishmentName}
            variant='client'
            text_variant={!establishmentName ? 'welcome' : 'on-establishment'}
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            onLogoClick={() => {
              router.push('/home');
              setMenuOpen(false);
            }}
          />
          {children}
          <CartEmptyError />
        </div>
        <div className='flex-none'>
          <NavigationMenu
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
            variant='client'
            menuItems={menu_items.map((item) => {
              if (item.href === '/home') {
                return {
                  label: item.label,
                  onClick: () => {
                    router.push('/home');
                    setMenuOpen(false);
                  },
                };
              }
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

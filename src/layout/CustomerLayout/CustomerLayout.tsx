import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import {
  Header,
  Navigation,
  NavigationMenu,
  StatusBar,
} from '@deuquantas/components';
import { MaxWidthWrapper } from '@deuquantas/components';
import { useState } from 'react';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { bottomNavItems, handleAddClick } = useNavigation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <StatusBar variant='client' />
      <Header
        name={user?.usuario?.name}
        variant='client'
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      {children}
      <NavigationMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        menuItems={[
          {
            label: 'Sair',
            onClick: () => {
              logout();
            },
          },
        ]}
      />
      <MaxWidthWrapper
        backgroundColor='#272727'
        style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
        }}
      >
        <Navigation items={bottomNavItems} onAddClick={handleAddClick} />
      </MaxWidthWrapper>
    </>
  );
}

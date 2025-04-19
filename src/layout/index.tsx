import { useAuth } from '@/contexts/AuthContext';
import { menu_items } from '@/data/menu';
import { useNavigation } from '@/hooks/useNavigation';
import {
  Header,
  Navigation,
  NavigationMenu,
  StatusBar,
} from '@deuquantas/components';
import { useState } from 'react';
import { useRouter } from 'next/router';
export default function Layout({ children }: { children: React.ReactNode }) {
  const { bottomNavItems, handleAddClick } = useNavigation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

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
      <Navigation items={bottomNavItems} onAddClick={handleAddClick} />
    </>
  );
}

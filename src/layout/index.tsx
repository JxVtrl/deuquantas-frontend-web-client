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
      <div className="flex flex-col h-screen fixed inset-0">
        <div className="flex-none">
          <StatusBar variant='client' />
          <Header
            name={user?.usuario?.name}
            variant='client'
            menuOpen={menuOpen}
            setMenuOpen={setMenuOpen}
          />
        </div>
        <div className='flex-1 overflow-y-auto relative'>
          <div className="absolute inset-0 overflow-y-auto">
            {children}
          </div>
        </div>
        <div className="flex-none">
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
          <Navigation items={bottomNavItems} onAddClick={handleAddClick} />
        </div>
      </div>
    </>
  );
}

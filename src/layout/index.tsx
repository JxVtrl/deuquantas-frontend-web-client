import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import {
    Header,
    Navigation,
    NavigationMenu,
    StatusBar,
} from '@deuquantas/components';
import { useState } from 'react';

export default function Layout({
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
            <Navigation items={bottomNavItems} onAddClick={handleAddClick} />
        </>
    );
}

import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import { Header, Navigation, StatusBar } from '@deuquantas/components';
import { MaxWidthWrapper } from '@deuquantas/components';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { bottomNavItems, handleAddClick } = useNavigation();
  const { user, logout } = useAuth();

  return (
    <>
      <StatusBar />
      <Header
        name={user?.usuario?.name}
        variant='client'
        menu_items={[
          {
            label: 'Sair',
            onClick: () => {
              logout();
            },
          },
        ]}
      />
      {children}
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

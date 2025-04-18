import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { useNavigation } from '@/hooks/useNavigation';
import { Navigation } from '@deuquantas/components';
import { MaxWidthWrapper } from '@deuquantas/components';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { bottomNavItems, handleAddClick } = useNavigation();

  return (
    <>
      <StatusBar />
      <Header />
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

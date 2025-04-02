import { BottomNavigation } from '@/components/BottomNavigation';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';
import { useNavigation } from '@/hooks/useNavigation';

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
      <BottomNavigation items={bottomNavItems} onAddClick={handleAddClick} />
    </>
  );
}

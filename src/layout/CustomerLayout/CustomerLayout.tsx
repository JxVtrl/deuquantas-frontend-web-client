import { BottomNavigation } from '@/components/BottomNavigation';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StatusBar />
      <Header />
      {children}
      <BottomNavigation />
    </>
  );
}

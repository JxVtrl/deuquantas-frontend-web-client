import { BottomNavigation } from '@/components/BottomNavigation';
import { Header } from '@/components/Header';
import { StatusBar } from '@/components/StatusBar';

export default function EstablishmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StatusBar isEstablishment />
      <Header isEstablishment />
      {children}
      <BottomNavigation isEstablishment />
    </>
  );
}

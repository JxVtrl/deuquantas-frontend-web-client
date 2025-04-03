import { useState } from 'react';
// import { useRouter } from 'next/router';
import {
  ScanIcon,
  ConsumptionIcon,
  FavoriteIcon,
  OrdersIcon,
  LocationIcon,
  HomeIcon,
  MoneyIcon,
} from '@/components/Icons';

export interface NavigationPill {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export interface ActionItem {
  icon: React.FC;
  label: string;
  href: string;
}

export interface NavigationItem {
  icon: React.FC;
  label: string;
  href: string;
}

export const useNavigation = () => {
  // const router = useRouter();
  const [activePill, setActivePill] = useState('scan');

  const navigationPills: NavigationPill[] = [
    {
      label: 'Scan QR',
      isActive: activePill === 'scan',
      onClick: () => setActivePill('scan'),
    },
    {
      label: 'Histórico de compras',
      isActive: activePill === 'history',
      onClick: () => setActivePill('history'),
    },
    {
      label: 'Limite de compras',
      isActive: activePill === 'limit',
      onClick: () => setActivePill('limit'),
    },
  ];

  const actionItems: ActionItem[] = [
    {
      icon: ScanIcon,
      label: 'Scan QR',
      href: '/customer/home/qr-code',
    },
    {
      icon: ConsumptionIcon,
      label: 'Consumo',
      href: '/consumo',
    },
    {
      icon: FavoriteIcon,
      label: 'Favoritos',
      href: '/favoritos',
    },
    {
      icon: OrdersIcon,
      label: 'Pedidos',
      href: '/pedidos',
    },
    {
      icon: LocationIcon,
      label: 'Locais',
      href: '/locais',
    },
  ];

  const bottomNavItems: NavigationItem[] = [
    {
      icon: HomeIcon,
      label: 'Início',
      href: '/customer/home',
    },
    {
      icon: MoneyIcon,
      label: 'Conta',
      href: '/customer/account',
    },
    {
      icon: FavoriteIcon,
      label: 'Favoritos',
      href: '/customer/favorites',
    },
  ];

  const handleAddClick = () => {
    // Implement add functionality
    console.log('Add clicked');
  };

  return {
    navigationPills,
    actionItems,
    bottomNavItems,
    handleAddClick,
  };
};

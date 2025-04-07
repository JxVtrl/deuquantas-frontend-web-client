import { FavoriteIcon } from '@/components/Icons';

import { HomeIcon } from '@/components/Icons';

import { MoneyIcon } from '@/components/Icons';
import { QrCodeIcon, TableIcon } from 'lucide-react';
export const establishmentBottomNavigation = [
  {
    icon: HomeIcon,
    label: 'Início',
    href: '/establishment/home',
  },
  {
    icon: QrCodeIcon,
    label: 'QR Codes',
    href: '/establishment/manage/qr-codes',
  },
  {
    icon: TableIcon,
    label: 'Mesas',
    href: '/establishment/manage/tables',
  },
];

export const customerBottomNavigation = [
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

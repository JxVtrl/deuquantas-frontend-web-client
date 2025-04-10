import { FavoriteIcon } from '@/components/Icons';
import { HomeIcon } from '@/components/Icons';
import { MoneyIcon } from '@/components/Icons';

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

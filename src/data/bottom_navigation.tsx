import { FavoriteIcon } from '@/components/Icons';
import { HomeIcon } from '@/components/Icons';
import { MoneyIcon } from '@/components/Icons';

export const customerBottomNavigation = [
  {
    icon: HomeIcon,
    label: 'Início',
    href: '/home',
  },
  {
    icon: MoneyIcon,
    label: 'Conta',
    href: '/account',
  },
  {
    icon: FavoriteIcon,
    label: 'Favoritos',
    href: '/favorites',
  },
];

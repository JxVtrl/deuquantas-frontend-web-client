import { ComandaCardProps } from '@/interfaces/comanda';
import { ReceiptIcon, DrinksIcon, PeopleIcon } from '@deuquantas/components';

export const conta_buttons_navigation: ComandaCardProps[] = [
  {
    href: '/conta/menu',
    icon: {
      src: () => <DrinksIcon />,
      alt: 'Garrafas',
      width: 20,
      height: 22,
    },
    title: <>Menu</>,
  },
  {
    href: '/conta/comanda',
    icon: {
      src: () => <ReceiptIcon />,
      alt: 'Comanda',
      width: 20,
      height: 23,
    },
    title: <>Comanda</>,
  },
  {
    href: '/conta/pessoas',
    icon: {
      src: () => <PeopleIcon />,
      alt: 'Pessoas',
      width: 20,
      height: 15,
    },
    title: <>Pessoas</>,
  },
];

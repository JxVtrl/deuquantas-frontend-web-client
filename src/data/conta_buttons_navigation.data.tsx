import { ComandaCardProps } from '@/interfaces/comanda';

export const conta_buttons_navigation: ComandaCardProps[] = [
  {
    href: '/conta/menu',
    icon: {
      src: '/icons/bottles.svg',
      alt: 'Garrafas',
      width: 20,
      height: 22,
    },
    title: <>Menu</>,
  },
  {
    href: '/conta/comanda',
    icon: {
      src: '/icons/receipt.svg',
      alt: 'Comanda',
      width: 20,
      height: 23,
    },
    title: <>Comanda</>,
  },
  {
    href: '/conta/pessoas',
    icon: {
      src: '/icons/people.svg',
      alt: 'Pessoas',
      width: 20,
      height: 15,
    },
    title: <>Pessoas</>,
  },
];

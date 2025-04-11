import { ComandaCardProps } from '@/interfaces/comanda';

export const conta_buttons_navigation: ComandaCardProps[] = [
  {
    href: '/conta/menu',
    icon: {
      src: '/icons/bottles.svg',
      alt: 'Garrafas',
    },
    title: <>Menu</>,
  },
  {
    href: '/conta/comanda',
    icon: {
      src: '/icons/receipt.svg',
      alt: 'Comanda',
    },
    title: <>Comanda</>,
  },
  {
    href: '/conta/pessoas',
    icon: {
      src: '/icons/people.svg',
      alt: 'Pessoas',
    },
    title: <>Pessoas</>,
  },
];

import { ComandaCardProps } from '@/interfaces/comanda';

export const cards: ComandaCardProps[] = [
  {
    href: '/comandas/[mesa_id]/cardapio',
    icon: {
      src: '/icons/bottles.svg',
      alt: 'Ícone de comandas',
    },
    title: (
      <>
        Acessar
        <br />
        Cardápio
      </>
    ),
  },
  {
    href: '/comandas/[mesa_id]/conta',
    icon: {
      src: '/icons/receipt.svg',
      alt: 'Ícone de comandas',
    },
    title: (
      <>
        Pedir
        <br />a conta
      </>
    ),
  },
];

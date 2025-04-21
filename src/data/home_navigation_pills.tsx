export interface NavigationPill {
  label: string;
  isActive?: boolean;
}

export const customerNavigationPills: NavigationPill[] = [
  {
    label: 'Scan QR',
  },
  {
    label: 'Histórico de compras',
  },
  {
    label: 'Limite de compras',
  },
];

export const contaNavigationPills: NavigationPill[] = [
  {
    label: 'Meus Pedidos',
  },
  {
    label: 'Limite de compras',
  },
  {
    label: 'Crédito de compras',
  },
];

export const menuNavigationPills: NavigationPill[] = [
  {
    label: 'Menu',
    isActive: true,
  },
  {
    label: 'Bebidas',
  },
  {
    label: 'Petiscos',
  },
  {
    label: 'Refeições',
  },
];

import {
  ConsumptionIcon,
  FavoriteIcon,
  LocationIcon,
  OrdersIcon,
  ScanIcon,
} from '@deuquantas/components';

export interface ActionItem {
  icon: React.FC;
  label: string;
  href: string;
}

export const actions: ActionItem[] = [
  {
    icon: ScanIcon,
    label: 'Scan QR',
    href: '/qr-code',
  },
  {
    icon: ConsumptionIcon,
    label: 'Consumo',
    href: '/home/consumption',
  },
  {
    icon: FavoriteIcon,
    label: 'Favoritos',
    href: '/home/favorites',
  },
  {
    icon: OrdersIcon,
    label: 'Pedidos',
    href: '/home/orders',
  },
  {
    icon: LocationIcon,
    label: 'Locais',
    href: '/home/locations',
  },
];

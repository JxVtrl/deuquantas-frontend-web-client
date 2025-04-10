import {
  ConsumptionIcon,
  FavoriteIcon,
  LocationIcon,
  OrdersIcon,
  ScanIcon,
} from '@/components/Icons';

export interface ActionItem {
  icon: React.FC;
  label: string;
  href: string;
}

export const customerActions: ActionItem[] = [
  {
    icon: ScanIcon,
    label: 'Scan QR',
    href: '/customer/qr-code',
  },
  {
    icon: ConsumptionIcon,
    label: 'Consumo',
    href: '/customer/home/consumption',
  },
  {
    icon: FavoriteIcon,
    label: 'Favoritos',
    href: '/customer/home/favorites',
  },
  {
    icon: OrdersIcon,
    label: 'Pedidos',
    href: '/customer/home/orders',
  },
  {
    icon: LocationIcon,
    label: 'Locais',
    href: '/customer/home/locations',
  },
];

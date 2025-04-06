import {
  ConsumptionIcon,
  FavoriteIcon,
  LocationIcon,
  OrdersIcon,
  ScanIcon,
  TableIcon,
} from '@/components/Icons';

export interface ActionItem {
  icon: React.FC;
  label: string;
  href: string;
}

export const establishmentActions: ActionItem[] = [
  {
    icon: TableIcon,
    label: 'Gerenciar mesas',
    href: '/establishment/manage/tables',
  },
];

export const customerActions: ActionItem[] = [
  {
    icon: ScanIcon,
    label: 'Scan QR',
    href: '/customer/home/qr-code',
  },
  {
    icon: ConsumptionIcon,
    label: 'Consumo',
    href: '/consumo',
  },
  {
    icon: FavoriteIcon,
    label: 'Favoritos',
    href: '/favoritos',
  },
  {
    icon: OrdersIcon,
    label: 'Pedidos',
    href: '/pedidos',
  },
  {
    icon: LocationIcon,
    label: 'Locais',
    href: '/locais',
  },
];

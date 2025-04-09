import {
  ConsumptionIcon,
  // DashboardIcon,
  FavoriteIcon,
  LocationIcon,
  OrdersIcon,
  RequestIcon,
  ScanIcon,
  TableIcon,
} from '@/components/Icons';
import { QrCodeIcon } from 'lucide-react';

export interface ActionItem {
  icon: React.FC;
  label: string;
  href: string;
}

export const establishmentActions: ActionItem[] = [
  {
    icon: RequestIcon,
    label: 'Solicitações',
    href: '/establishment/manage/requests',
  },
  {
    icon: QrCodeIcon,
    label: 'QR Codes',
    href: '/establishment/manage/qr-codes',
  },
  {
    icon: TableIcon,
    label: 'Mesas',
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

import {
  ConsumptionIcon,
  DashboardIcon,
  FavoriteIcon,
  LocationIcon,
  OrdersIcon,
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
    icon: DashboardIcon,
    label: 'Dashboard',
    href: '/establishment/dashboard',
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

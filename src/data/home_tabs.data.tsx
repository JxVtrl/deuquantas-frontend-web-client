import { ComandaCards, ComandaConfirm } from '@/components/Comanda';
import QrCodeCard from '@/components/QrCodeCard';
import { HomeTabs } from '@/interfaces/tab';
import { Benefits, PurchaseHistory } from '@/sections';

export const tabs: HomeTabs[] = [
  {
    id: 0,
    value: 'qr-code',
    title: 'QrCode',
    content: (
      <>
        <QrCodeCard />
        <Benefits />
      </>
    ),
  },
  {
    id: 1,
    value: 'comanda',
    title: 'Comanda',
    content: (
      <>
        <ComandaCards />
        <ComandaConfirm />
        <Benefits />
      </>
    ),
  },
  {
    id: 2,
    value: 'purchase-history',
    title: 'Histórico de compras',
    content: (
      <>
        <PurchaseHistory />
      </>
    ),
  },
  {
    id: 3,
    value: 'payment-credit',
    title: 'Crédito de compras',
    content: <></>,
  },
  {
    id: 4,
    value: 'purchase-limit',
    title: 'Limite de gastos',
    content: <></>,
  },
];

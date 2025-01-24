import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomerContext } from '@/contexts/CustomerContext';
import QrCodeCard from '@/components/QrCodeCard';
import Benefits from '@/sections/Benefits';
import { PurchaseHistory } from '@/sections/PurchaseHistory';
import { HomeTabs } from '@/interfaces/tab';
import { useRouter } from 'next/router';
import { ComandaCards, ComandaConfirm } from '@/components/Comanda';

const HomeTab: React.FC = () => {
  const { setActiveHomeTab, activeHomeTab } = useCustomerContext();

  const router = useRouter();

  const tabs: HomeTabs[] = [
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

  const filteredTabs =
    router.pathname === '/customer/home'
      ? tabs.filter((tab) => tab.value !== 'comanda')
      : tabs.filter((tab) => tab.value !== 'qr-code');

  return (
    <div className='w-full px-[16px] my-[24px]'>
      <Tabs defaultValue={activeHomeTab}>
        <TabsList>
          {filteredTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.value}
              onClick={() => setActiveHomeTab(tab.value)}
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {filteredTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default HomeTab;

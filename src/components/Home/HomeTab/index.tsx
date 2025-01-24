import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomerContext } from '@/contexts/CustomerContext';
import QrCodeCard from '../../QrCodeCard';
import Benefits from '@/sections/Benefits';
import { PurchaseHistory } from '@/sections/PurchaseHistory';
import { HomeTabs } from '@/interfaces/tab';

const HomeTab: React.FC = () => {
  const { setActiveHomeTab, activeHomeTab } = useCustomerContext();

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
      value: 'purchase-history',
      title: 'Histórico de compras',
      content: (
        <>
          <PurchaseHistory />
        </>
      ),
    },
    {
      id: 2,
      value: 'payment-credit',
      title: 'Crédito de compras',
      content: <></>,
    },
    {
      id: 3,
      value: 'purchase-limit',
      title: 'Limite de gastos',
      content: <></>,
    },
  ];

  return (
    <div className='w-full px-[16px] my-[24px]'>
      <Tabs defaultValue={activeHomeTab}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.value}
              onClick={() => setActiveHomeTab(tab.value)}
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.value}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default HomeTab;

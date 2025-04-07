import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomerContext } from '@/contexts/CustomerContext';
import { useRouter } from 'next/router';
import { tabs } from '@/data/home_tabs.data';

// Constantes para os valores das tabs
const TAB_VALUES = {
  QR_CODE: 'qr-code',
  COMANDA: 'comanda',
} as const;

const HomeTab: React.FC = () => {
  const { setActiveHomeTab, activeHomeTab } = useCustomerContext();
  const router = useRouter();

  // Filtra as tabs com base na rota atual
  const filteredTabs = useMemo(() => {
    const isComandaPage = router.pathname === '/customer/comanda';
    const activeTab = isComandaPage ? TAB_VALUES.COMANDA : TAB_VALUES.QR_CODE;

    setActiveHomeTab(activeTab);

    return tabs.filter((tab) =>
      isComandaPage
        ? tab.value !== TAB_VALUES.QR_CODE
        : tab.value !== TAB_VALUES.COMANDA,
    );
  }, [router.pathname, setActiveHomeTab]);

  return (
    <div className='w-full px-[16px] my-[24px] overflow-scroll'>
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

import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomerContext } from '@/contexts/CustomerContext';
import { HomeTabs } from '@/interfaces/tab';
import { useRouter } from 'next/router';
import { tabs } from '@/data/home_tabs.data';

const HomeTab: React.FC = () => {
  const [filteredTabs, setFilteredTabs] = React.useState<HomeTabs[]>([]);
  const { setActiveHomeTab, activeHomeTab } = useCustomerContext();

  const router = useRouter();

  useEffect(() => {
    if (router.pathname === '/customer/comanda/[mesa_id]') {
      setActiveHomeTab('comanda');
      setFilteredTabs(tabs.filter((tab) => tab.value !== 'qr-code'));
    } else {
      setActiveHomeTab('qr-code');
      setFilteredTabs(tabs.filter((tab) => tab.value !== 'comanda'));
    }
  }, [router.pathname]);

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

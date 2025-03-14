import { PurchaseHistoryItem } from '@/interfaces/purchase';
import { HomeTabList } from '@/interfaces/tab';
import { createContext, ReactNode, useContext, useState } from 'react';

interface CustomerContextData {
  activeHomeTab: HomeTabList;
  setActiveHomeTab: (tab: HomeTabList) => void;
  purchaseHistory: PurchaseHistoryItem[];
  setPurchaseHistory: (history: PurchaseHistoryItem[]) => void;
}

export const CustomerContext = createContext<CustomerContextData>(
  {} as CustomerContextData,
);
CustomerContext.displayName = 'CustomerContext';

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [activeHomeTab, setActiveHomeTab] = useState<HomeTabList>('qr-code');
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>(
    [],
  );

  return (
    <CustomerContext.Provider
      value={{
        activeHomeTab,
        setActiveHomeTab,
        purchaseHistory,
        setPurchaseHistory,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error('useCustomerContext must be used under CustomerProvider');
  }

  return context;
};

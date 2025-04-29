import { PurchaseHistoryItem } from '@/interfaces/purchase';
import { HomeTabList } from '@/interfaces/tab';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import Bowser from 'bowser';

interface CustomerContextData {
  activeHomeTab: HomeTabList;
  setActiveHomeTab: (tab: HomeTabList) => void;
  purchaseHistory: PurchaseHistoryItem[];
  setPurchaseHistory: (history: PurchaseHistoryItem[]) => void;
  isSafari: boolean;
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
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const browser = Bowser.getParser(window.navigator.userAgent);
    const isSafari = browser.getBrowserName() === 'Safari';
    console.log('isSafari', isSafari);
    setIsSafari(isSafari);
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        activeHomeTab,
        setActiveHomeTab,
        purchaseHistory,
        setPurchaseHistory,
        isSafari,
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

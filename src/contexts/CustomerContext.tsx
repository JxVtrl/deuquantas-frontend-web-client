import { createContext, ReactNode, useContext, useState } from "react";

interface CustomerContextData {
  activeHomeTab: string;
  setActiveHomeTab: (tab: string) => void;
}

export const CustomerContext = createContext<CustomerContextData>(
  {} as CustomerContextData
);
CustomerContext.displayName = "CustomerContext";

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [activeHomeTab, setActiveHomeTab] = useState("qr-code");

  return (
    <CustomerContext.Provider
      value={{
        activeHomeTab,
        setActiveHomeTab,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error("useCustomerContext must be used under CustomerProvider");
  }

  return context;
};

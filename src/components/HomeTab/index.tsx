import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HomeTab: React.FC = () => {
  return (
    <div className="w-full px-[16px] my-[24px]">
      <Tabs defaultValue="qr-code">
        <TabsList>
          <TabsTrigger value="qr-code">QrCode</TabsTrigger>
          <TabsTrigger value="purchase-history">
            Histórico de compras
          </TabsTrigger>
          <TabsTrigger value="payment-credit">Crédito de compras</TabsTrigger>
          <TabsTrigger value="purchase-limit">Limite de gastos</TabsTrigger>
        </TabsList>
        <TabsContent value="qr-code">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="purchase-history">
          Change your password here.
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HomeTab;

import { withAuthCustomer } from "@/hoc/withAuth";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductType } from "@/interfaces/product";
import CustomerLayout from "@/layout/CustomerLayout";

const Page: React.FC = () => {
  const [menuItems, setMenuItems] = useState<ProductType[]>([]);

  const getProducts = async () => {
    // Simulação de requisição à API
    const response = await fetch("/api/products");
    const data = await response.json();
    setMenuItems(data);
  };

  const handleAddToOrder = (item: ProductType) => {
    console.log("Adicionando item à comanda", item);
  };

  useEffect(() => {
    // get products from api mock
    getProducts();
  }, []);

  return (
    <CustomerLayout>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="w-full max-w-4xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center">
            Menu do Estabelecimento
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Escolha seus itens e adicione à comanda.
          </p>

          {/* Lista de Itens do Menu */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-gray-100 rounded-lg shadow-sm flex flex-col items-center text-center"
              >
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="mt-2 text-gray-600">{item.price}</p>
                <Button
                  onClick={() => handleAddToOrder(item)}
                  className="mt-4 w-full"
                >
                  Adicionar à Comanda
                </Button>
              </div>
            ))}
          </div>

          {/* Botão para Timeline da Comanda */}
          <div className="mt-8 flex justify-center">
            <Link href="/customer/comanda/timeline">
              <Button size="lg">Visualizar Comanda</Button>
            </Link>
          </div>

          {/* Botão para Fechar Comanda */}
          <div className="mt-4 flex justify-center">
            <Link href="/customer/comanda/close">
              <Button size="lg">Fechar Comanda</Button>
            </Link>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default withAuthCustomer(Page);

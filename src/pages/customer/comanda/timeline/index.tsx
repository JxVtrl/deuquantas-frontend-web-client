import { withAuthCustomer } from "@/hoc/withAuth";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CustomerLayout from "@/layout/CustomerLayout";

const Page: React.FC = () => {
  // Estado fictício para os itens da comanda
  const [orderItems] = useState([
    {
      id: 1,
      name: "Cerveja Pilsen",
      quantity: 2,
      price: 8.0,
      status: "Entregue",
    },
    {
      id: 2,
      name: "Caipirinha de Limão",
      quantity: 1,
      price: 12.0,
      status: "Em preparo",
    },
    {
      id: 3,
      name: "Porção de Batata Frita",
      quantity: 1,
      price: 18.0,
      status: "Pedido recebido",
    },
  ]);

  // Calcula o total da comanda
  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CustomerLayout>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="w-full max-w-4xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center">Minha Comanda</h1>
          <p className="text-gray-600 text-center mt-2">
            Acompanhe os itens e o status dos seus pedidos.
          </p>

          {/* Lista de Itens da Comanda */}
          <div className="mt-6">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-4 border-b border-gray-200"
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    Quantidade: {item.quantity} | R$ {item.price.toFixed(2)}{" "}
                    cada
                  </p>
                  <p className="text-sm text-gray-500">Status: {item.status}</p>
                </div>
                <p className="text-lg font-bold">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Total da Comanda */}
          <div className="mt-6 flex items-center justify-between text-lg font-bold border-t pt-4">
            <p>Total</p>
            <p>R$ {total.toFixed(2)}</p>
          </div>

          {/* Botão para Voltar ao Menu */}
          <div className="mt-8 flex justify-center">
            <Link href="/customer/menu">
              <Button size="lg">Voltar ao Menu</Button>
            </Link>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default withAuthCustomer(Page);

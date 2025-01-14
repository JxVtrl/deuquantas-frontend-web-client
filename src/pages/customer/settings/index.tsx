import { withAuthCustomer } from '@/hoc/withAuth';
import React from 'react';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserType } from '@/interfaces/user';

const Page: React.FC = () => {
 const [formData, setFormData] = useState<UserType>({
    name: "João Silva",
    phone: "(00) 00000-0000",
    cpf: "000.000.000-00",
    notifications: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: UserType) => ({ ...prev, [name]: value }));
  };

  const handleToggleNotifications = () => {
    setFormData((prev) => ({ ...prev, notifications: !prev.notifications }));
  };

  const handleSave = () => {
    // Lógica para salvar as alterações (placeholder)
    alert("Configurações salvas com sucesso!");
  };

  const handleLogout = () => {
    // Lógica para logout (placeholder)
    alert("Você saiu da conta.");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center">Configurações</h1>
        <p className="text-gray-600 text-center mt-2">Gerencie seu perfil e preferências.</p>

        {/* Formulário de Configurações */}
        <form className="mt-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
              CPF
            </label>
            <input
              type="text"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Notificações</span>
            <button
              type="button"
              onClick={handleToggleNotifications}
              className={`px-4 py-2 rounded-full ${
                formData.notifications ? "bg-indigo-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              {formData.notifications ? "Ativadas" : "Desativadas"}
            </button>
          </div>
          <Button type="button" onClick={handleSave} className="w-full">
            Salvar Alterações
          </Button>
        </form>

        {/* Botão de Logout */}
        <div className="mt-6 text-center">
          <Button variant="destructive" onClick={handleLogout} className="w-full">
            Sair da Conta
          </Button>
        </div>
      </div>
    </div>
  );
}

export default withAuthCustomer(Page);
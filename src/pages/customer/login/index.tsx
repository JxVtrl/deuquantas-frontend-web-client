// pages/customer/login.js
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CustomerLogin() {
  const [isRegister, setIsRegister] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center">
          {isRegister ? "Cadastro de Cliente" : "Login do Cliente"}
        </h1>
        <p className="text-gray-600 text-center mt-2">
          {isRegister
            ? "Preencha os campos abaixo para criar sua conta."
            : "Acesse sua conta para gerenciar suas comandas."}
        </p>

        {/* Formulário */}
        <form className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());
            console.log(data);

            // Simulação de cadastro/login

            // redireciona para a tela de qr-code
            router.push("/customer/qr-code");
          }}
        
        >
          {isRegister && (
            <>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Seu nome completo"
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
                  placeholder="000.000.000-00"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Número de Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="(00) 00000-0000"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <Button type="submit" className="w-full">
            {isRegister ? "Cadastrar" : "Entrar"}
          </Button>
        </form>

        {/* Alternar entre Login e Cadastro */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {isRegister ? "Já tem uma conta?" : "Ainda não tem uma conta?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-indigo-600 font-medium hover:underline"
            >
              {isRegister ? "Faça login" : "Cadastre-se"}
            </button>
          </p>
        </div>

        {/* Link para o login do Estabelecimento */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            É um estabelecimento?{" "}
            <Link href="/establishment/login" className="text-indigo-600 font-medium hover:underline">
                Acesse aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

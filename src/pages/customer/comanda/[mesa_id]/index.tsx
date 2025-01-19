import { useRouter } from "next/router";
import CustomerLayout from "@/layout/CustomerLayout";

const ComandaPage = () => {
  const router = useRouter();
  const { mesa_id, clienteId } = router.query;

  if (!mesa_id || !clienteId) {
    return (
      <CustomerLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-600 text-lg">Carregando...</p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="flex flex-col items-center justify-center h-full p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Bem-vindo, Cliente {clienteId}!
          </h1>
          <p className="text-lg text-gray-600 text-center">
            Comanda aberta para a mesa <span className="font-semibold text-blue-500">{mesa_id}</span>.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default ComandaPage;

import { Button } from "@/components/ui/button";
import { withAuthCustomer } from "@/hoc/withAuth";
import CustomerLayout from "@/layout/CustomerLayout";
import { useRouter } from "next/router";

const Page: React.FC = () => {
  const router = useRouter();

  const handleQRCodeScan = () => {
    // Lógica de escaneamento do QR Code (placeholder)
    alert("QR Code escaneado com sucesso!");

    // Redireciona para a tela do menu
    router.push("/customer/menu");
  };

  return (
    <CustomerLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center">Escolha sua mesa</h1>
          <p className="text-gray-600 text-center mt-2">
            Escaneie o QR Code ou insira o código da mesa manualmente.
          </p>

          {/* Botão para escanear QR Code */}
          <div className="mt-6 flex justify-center">
            <Button onClick={handleQRCodeScan} className="w-full">
              Escanear QR Code
            </Button>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default withAuthCustomer(Page);

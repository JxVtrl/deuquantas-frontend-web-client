import { withAuthCustomer } from '@/hoc/withAuth';
import React, { useState } from 'react';
import { CustomerLayout } from '@/layout';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/router';
import { useCustomerContext } from '@/contexts/CustomerContext';
import { ComandaService, CreateComandaDto } from '@/services/comanda.service';
import { useAuth } from '@/contexts/AuthContext';
import { ScanQrCodeIcon } from '@/components/Icons';
import InputQrCode from '@/components/InputQrCode';
import Cookies from 'js-cookie';

const CustomerScan: React.FC = () => {
  const router = useRouter();
  const { setActiveHomeTab } = useCustomerContext();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navegarParaComanda = (mesaId: string, clienteId: string) => {
    try {
      setActiveHomeTab('comanda');
      const path = `/customer/comanda/${mesaId}?clienteId=${clienteId}`;
      console.log('Redirecionando para:', path);

      setTimeout(() => {
        router.push(path).catch((err) => {
          console.error('Erro ao navegar:', err);
          setError(
            'Erro ao navegar para a página da comanda. Tente novamente.',
          );
        });
      }, 100);
    } catch (err) {
      console.error('Erro ao navegar para comanda:', err);
      setError('Erro ao navegar para a página da comanda. Tente novamente.');
    }
  };

  const processarQrCode = async (qrCode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Validar formato do QR Code
      const partes = qrCode.split(':');
      if (
        partes.length !== 4 ||
        partes[0] !== 'estabelecimento' ||
        partes[2] !== 'mesa'
      ) {
        setError('QR Code inválido. Tente novamente.');
        return;
      }

      const estabelecimentoId = partes[1];
      const mesaId = partes[3];

      // Verificar disponibilidade da mesa
      const disponivel = await ComandaService.verificarDisponibilidadeMesa(
        estabelecimentoId,
        mesaId,
      );
      if (!disponivel) {
        setError('Mesa não está disponível no momento.');
        return;
      }

      // Obter token de autenticação
      const token = Cookies.get('token') || '';

      if (!user) {
        setError('Usuário não autenticado. Faça login novamente.');
        return;
      }

      const clienteCpf = user?.cliente?.num_cpf
        ? String(user.cliente.num_cpf)
        : '';

      if (!clienteCpf) {
        setError(
          'Não foi possível identificar o usuário. Faça login novamente.',
        );
        return;
      }

      // Criar comanda
      const dataAtual = new Date().toISOString();
      const comandaData: CreateComandaDto = {
        num_cpf: clienteCpf,
        num_cnpj: estabelecimentoId,
        numMesa: mesaId,
        datApropriacao: dataAtual,
        horPedido: dataAtual,
        codItem: '0',
        numQuant: 0,
        valPreco: 0,
      };

      const response = await ComandaService.criarComanda(comandaData, token);
      console.log('Comanda criada com sucesso!', response);
      setSuccessMessage('Comanda criada com sucesso!');

      // Navegar para a comanda
      navegarParaComanda(mesaId, clienteCpf);
    } catch (err) {
      console.error('Erro ao processar QR Code:', err);
      setError('Erro ao processar QR Code. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <style jsx global>{`
        .qr-scanner svg {
          display: none !important;
        }
        #scan-qr-code-icon {
          display: block !important;
        }
      `}</style>
      <div>
        {error && (
          <div className='fixed top-2 left-2 right-2 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            <span className='block sm:inline'>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className='fixed top-2 left-2 right-2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>
            <span className='block sm:inline'>{successMessage}</span>
          </div>
        )}

        {isLoading ? (
          <div className='fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFCC00]'></div>
            <p className='ml-2 text-white'>Processando QR Code...</p>
          </div>
        ) : (
          <>
            <div className='qr-scanner'>
              <Scanner
                constraints={{}}
                styles={{
                  container: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: 0,
                    margin: 0,
                    zIndex: -1,
                  },
                  video: {
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'cover',
                  },
                }}
                onError={(err) => {
                  console.log('Erro ao escanear QR Code', err);
                  setError('Erro ao escanear QR Code. Tente novamente.');
                }}
                onScan={(result) => {
                  if (result && result.length > 0) {
                    processarQrCode(result[0].rawValue);
                  }
                }}
              />
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999999]'>
                <ScanQrCodeIcon />
                <InputQrCode onScan={processarQrCode} />
              </div>
            </div>
          </>
        )}
      </div>
    </CustomerLayout>
  );
};

export default withAuthCustomer(CustomerScan);

import { withAuthCustomer } from '@/hoc/withAuth';
import React, { useState } from 'react';
import { CustomerLayout } from '@/layout';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/router';
import { useCustomerContext } from '@/contexts/CustomerContext';
import { ComandaService, CreateComandaDto } from '@/services/comanda.service';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { ScanQrCodeIcon } from '@/components/Icons';
import InputQrCode from '@/components/InputQrCode';
/**
 * Componente para escaneamento de QR Code
 */
const CustomerQrCode: React.FC = () => {
  const router = useRouter();
  const { setActiveHomeTab } = useCustomerContext();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Estado para indicar se estamos em modo offline
  // Estado para mostrar mensagem de sucesso
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Função para navegar para a página da comanda com tratamento de erro
  const navegarParaComanda = (mesaId: string, clienteId: string) => {
    try {
      // Definir a aba ativa antes de navegar
      setActiveHomeTab('comanda');

      // Usar um caminho mais simples para evitar problemas de rota
      const path = `/customer/comanda/${mesaId}?clienteId=${clienteId}`;
      console.log('Redirecionando para:', path);

      // Usar setTimeout para garantir que a navegação ocorra após a atualização do estado
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

  const criarComanda = async (mesaId: string, estabelecimentoId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Verificar se o backend está disponível
      const backendAvailable = await ComandaService.isBackendAvailable();

      if (!backendAvailable) {
        console.warn('Backend não está disponível.');
        setError('Servidor não está disponível. Tente novamente mais tarde.');
        setIsLoading(false);
        return;
      }

      // Obter token de autenticação do localStorage ou de onde estiver armazenado
      const token = localStorage.getItem('token') || '';

      // Verificar se o usuário está autenticado
      if (!user) {
        setError('Usuário não autenticado. Faça login novamente.');
        setIsLoading(false);
        return;
      }

      // Obter CPF do usuário
      const clienteCpf = user?.id ? String(user.id) : '';

      // Se não tiver ID de usuário, não permitir continuar
      if (!clienteCpf) {
        setError(
          'Não foi possível identificar o usuário. Faça login novamente.',
        );
        setIsLoading(false);
        return;
      }

      // Dados para criar a comanda
      const dataAtual = new Date().toISOString();
      const comandaData: CreateComandaDto = {
        numCpf: clienteCpf,
        numCnpj: estabelecimentoId, // CNPJ do estabelecimento extraído do QR code
        numMesa: mesaId,
        datApropriacao: dataAtual,
        horPedido: dataAtual,
        codItem: '0', // Item inicial vazio ou padrão
        numQuant: 0,
        valPreco: 0,
      };

      try {
        console.log('Tentando criar comanda:', comandaData);
        const response = await ComandaService.criarComanda(comandaData, token);
        console.log('Comanda criada com sucesso!', response);
        setSuccessMessage('Comanda criada com sucesso!');
      } catch (apiError) {
        console.error('Erro na API ao criar comanda:', apiError);

        // Mensagem de erro mais informativa
        let errorMessage = 'Erro ao criar comanda.';

        if (axios.isAxiosError(apiError)) {
          if (!apiError.response) {
            errorMessage =
              'Erro de conexão com o servidor. Verifique sua conexão de internet ou se o servidor está em execução.';
          } else if (apiError.response.status === 401) {
            errorMessage = 'Não autorizado. Faça login novamente.';
          } else if (apiError.response.status === 400) {
            errorMessage =
              'Dados inválidos. Verifique as informações e tente novamente.';
          } else if (apiError.response.status === 500) {
            errorMessage =
              'Erro interno do servidor. Tente novamente mais tarde.';
          }
        }

        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Comanda criada com sucesso, redirecionar para a página da comanda
      navegarParaComanda(mesaId, clienteCpf);
    } catch (err) {
      console.error('Erro ao criar comanda:', err);

      // Se o erro já foi tratado e definido, não sobrescreve
      if (!error) {
        setError(
          'Erro ao criar comanda. Verifique sua conexão e tente novamente.',
        );
      }
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
                  try {
                    // Extrair informações do QR code
                    // Formato esperado: "estabelecimento:CNPJ:mesa:ID"
                    const qrData = result[0].rawValue;
                    const dataParts = qrData.split(':');

                    if (
                      dataParts.length < 4 ||
                      dataParts[0] !== 'estabelecimento'
                    ) {
                      setError('QR Code inválido. Tente novamente.');
                      return;
                    }

                    const estabelecimentoId = dataParts[1];
                    const mesaId = dataParts[3];

                    // Criar comanda e redirecionar
                    criarComanda(mesaId, estabelecimentoId);
                  } catch (err) {
                    console.error('Erro ao processar QR Code:', err);
                    setError('Erro ao processar QR Code. Formato inválido.');
                  }
                }}
              />
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999999]'>
                <ScanQrCodeIcon />
                <InputQrCode />
              </div>
            </div>
          </>
        )}
      </div>
    </CustomerLayout>
  );
};

export default withAuthCustomer(CustomerQrCode);

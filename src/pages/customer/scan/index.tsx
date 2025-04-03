import { withAuthCustomer } from '@/hoc/withAuth';
import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/router';
import { useCustomerContext } from '@/contexts/CustomerContext';
import { ComandaService, CreateComandaDto } from '@/services/comanda.service';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { StatusBar } from '@/components/StatusBar';
import { CodeInput } from '@/components/CodeInput';
import Image from 'next/image';
import Cookies from 'js-cookie';
const CustomerQrCode: React.FC = () => {
  const router = useRouter();
  const { setActiveHomeTab } = useCustomerContext();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const firstName = user?.name || 'Usuário';

  useEffect(() => {
    const checkBackendStatus = async () => {
      const isAvailable = await ComandaService.isBackendAvailable();
      setIsOfflineMode(!isAvailable);

      if (!isAvailable) {
        console.log('Aplicação iniciada em modo offline');
      }
    };

    checkBackendStatus();
  }, []);

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

  const criarComanda = async (mesaId: string, estabelecimentoId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      const backendAvailable = await ComandaService.isBackendAvailable();
      setIsOfflineMode(!backendAvailable);

      if (!backendAvailable) {
        console.warn('Backend não está disponível.');
        setError('Servidor não está disponível. Tente novamente mais tarde.');
        return;
      }

      const token = Cookies.get('auth_token') || '';

      if (!user) {
        setError('Usuário não autenticado. Faça login novamente.');
        return;
      }

      const clienteCpf = user?.id ? String(user.id) : '';

      if (!clienteCpf) {
        setError(
          'Não foi possível identificar o usuário. Faça login novamente.',
        );
        return;
      }

      const dataAtual = new Date().toISOString();
      const comandaData: CreateComandaDto = {
        numCpf: clienteCpf,
        numCnpj: estabelecimentoId,
        numMesa: mesaId,
        datApropriacao: dataAtual,
        horPedido: dataAtual,
        codItem: '0',
        numQuant: 0,
        valPreco: 0,
      };

      try {
        const response = await ComandaService.criarComanda(comandaData, token);
        console.log('Comanda criada com sucesso!', response);
        setSuccessMessage('Comanda criada com sucesso!');
        navegarParaComanda(mesaId, clienteCpf);
      } catch (apiError) {
        console.error('Erro na API ao criar comanda:', apiError);
        let errorMessage = 'Erro ao criar comanda.';

        if (axios.isAxiosError(apiError)) {
          if (!apiError.response) {
            errorMessage =
              'Erro de conexão com o servidor. Verifique sua conexão de internet.';
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
      }
    } catch (err) {
      console.error('Erro ao criar comanda:', err);
      if (!error) {
        setError(
          'Erro ao criar comanda. Verifique sua conexão e tente novamente.',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualCodeInput = (code: string) => {
    try {
      const dataParts = code.split(':');

      if (dataParts.length < 4 || dataParts[0] !== 'estabelecimento') {
        setError(
          'Código inválido. O formato deve ser estabelecimento:id:mesa:numero',
        );
        return;
      }

      const estabelecimentoId = dataParts[1];
      const mesaId = dataParts[3];

      criarComanda(mesaId, estabelecimentoId);
    } catch (err) {
      console.error('Erro ao processar código manual:', err);
      setError('Código inválido. Verifique o formato e tente novamente.');
    }
  };

  return (
    <div className='min-h-screen bg-[#FFCC00]'>
      <StatusBar />

      <header className='px-4 py-2 flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Image
            src='/brand/logo-dark.svg'
            alt='Logo DeuQuantas'
            width={56}
            height={24}
            quality={100}
            priority
          />
          <div className='flex items-center gap-2'>
            <div className='text-sm'>Bem-vindo</div>
            <div className='text-sm font-bold'>{firstName}</div>
          </div>
        </div>
        <button className='w-8 h-8 rounded-full bg-white flex items-center justify-center'>
          {firstName.charAt(0).toUpperCase()}
        </button>
      </header>

      <div className='flex-1 bg-black min-h-[calc(100vh-120px)] rounded-t-3xl mt-4 relative'>
        {isOfflineMode && (
          <div className='fixed top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs'>
            Modo Offline
          </div>
        )}

        {error && (
          <div className='absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            <span className='block sm:inline'>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className='absolute top-4 left-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>
            <span className='block sm:inline'>{successMessage}</span>
          </div>
        )}

        {isLoading ? (
          <div className='flex justify-center items-center h-full'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFCC00]'></div>
            <p className='ml-2 text-white'>Processando QR Code...</p>
          </div>
        ) : (
          <div className='relative h-full'>
            <Scanner
              styles={{
                container: {
                  position: 'relative',
                  width: '100%',
                  height: 'calc(100vh - 200px)',
                },
                video: {
                  width: '100%',
                  height: '100%',
                },
              }}
              onError={(err) => {
                console.log('Erro ao escanear QR Code', err);
                setError('Erro ao escanear QR Code. Tente novamente.');
              }}
              onScan={(result) => {
                try {
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

                  criarComanda(mesaId, estabelecimentoId);
                } catch (err) {
                  console.error('Erro ao processar QR Code:', err);
                  setError('Erro ao processar QR Code. Formato inválido.');
                }
              }}
            />
            <CodeInput onSubmit={handleManualCodeInput} isLoading={isLoading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuthCustomer(CustomerQrCode);

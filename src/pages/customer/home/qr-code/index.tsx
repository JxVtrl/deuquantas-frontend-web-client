import { withAuthCustomer } from '@/hoc/withAuth';
import React, { useState, useEffect, useRef } from 'react';
import { CustomerLayout } from '@/layout';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/router';
import { ComandaService } from '@/services/comanda.service';
import { useAuth } from '@/contexts/AuthContext';
import { ScanQrCodeIcon } from '@/components/Icons';
import QrCodeInput from '@/components/InputQrCode';
import { toast } from 'react-hot-toast';
import { mesaService, MesaSolicitacao } from '@/services/mesa.service';
import LoadingLottie from '@/components/LoadingLottie';
import Button from '@/components/Button';

/**
 * Componente para escaneamento de QR Code
 */
const CustomerQrCode: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [socketError, setSocketError] = useState(false);

  const processarQrCode = async (qrCode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      setShowScanner(false);
      setSocketError(false);

      // Validar formato do QR Code
      const partes = qrCode.split(':');
      if (
        partes.length !== 4 ||
        partes[0] !== 'estabelecimento' ||
        partes[2] !== 'mesa'
      ) {
        setError('QR Code inválido. Tente novamente.');
        setShowScanner(true);
        setIsLoading(false);
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
        setShowScanner(true);
        setIsLoading(false);
        return;
      }

      if (!user?.cliente?.num_cpf) {
        setError('Usuário não autenticado. Faça login novamente.');
        setShowScanner(true);
        setIsLoading(false);
        return;
      }

      // Solicitar mesa
      try {
        await mesaService.solicitarMesa(
          estabelecimentoId,
          mesaId,
          user.cliente.num_cpf.toString(),
        );
        setSuccessMessage(
          'Solicitação enviada. Aguardando aprovação do estabelecimento...',
        );
      } catch (socketErr) {
        console.error('Erro ao conectar com o socket:', socketErr);
        setSocketError(true);
        setError(
          'Erro ao conectar com o servidor. Tente novamente mais tarde.',
        );
        return;
      }

      // Configurar timeout de 2 minutos
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setError('Tempo de espera excedido. Tente novamente.');
        setShowScanner(true);
        setSuccessMessage(null);
        setIsLoading(false);
      }, 120000);
    } catch (err) {
      console.error('Erro ao processar QR Code:', err);
      setError('Erro ao processar QR Code. Tente novamente.');
      setShowScanner(true);
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    router.push('/customer/home');
  };

  useEffect(() => {
    const { num_cnpj, numMesa } = router.query;

    // Se tivermos os parâmetros na URL, processar a solicitação
    if (num_cnpj && numMesa && user?.cliente?.num_cpf) {
      const solicitarMesa = async () => {
        try {
          setIsLoading(true);
          setShowScanner(false);
          await mesaService.solicitarMesa(
            num_cnpj as string,
            numMesa as string,
            user?.cliente?.num_cpf as string,
          );
        } catch (error) {
          console.error(error);
          toast.error('Erro ao solicitar mesa');
          router.push('/customer/home');
        } finally {
          setIsLoading(false);
        }
      };

      solicitarMesa();
    }
  }, [router.query, user?.cliente?.num_cpf]);

  useEffect(() => {
    const handleAtualizacaoSolicitacao = (solicitacao: MesaSolicitacao) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (solicitacao.status === 'aprovado') {
        toast.success('Sua solicitação foi aprovada!');
        router.push(`/customer/comanda/${solicitacao.numMesa}`);
      } else if (solicitacao.status === 'rejeitado') {
        toast.error('Sua solicitação foi rejeitada');
        setShowScanner(true);
        setSuccessMessage(null);
        setIsLoading(false);
      }
    };

    mesaService.onAtualizacaoSolicitacao(handleAtualizacaoSolicitacao);

    return () => {
      mesaService.removerListeners();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
          <div className='fixed inset-0 z-50 flex flex-col justify-center items-center bg-black bg-opacity-50'>
            <LoadingLottie />
            <p className='mt-4 text-white text-lg'>
              {socketError
                ? 'Erro ao conectar com o servidor'
                : 'Processando QR Code...'}
            </p>
            <Button text='Cancelar' onClick={handleCancel} variant='primary' />
          </div>
        ) : showScanner ? (
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
                <QrCodeInput onScan={processarQrCode} />
              </div>
            </div>
          </>
        ) : (
          <div className='fixed inset-0 z-50 flex flex-col justify-center items-center bg-black bg-opacity-50'>
            <LoadingLottie />
            <p className='mt-4 text-white text-lg'>
              Aguardando resposta do estabelecimento...
            </p>
            <Button text='Cancelar' onClick={handleCancel} variant='primary' />
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default withAuthCustomer(CustomerQrCode);

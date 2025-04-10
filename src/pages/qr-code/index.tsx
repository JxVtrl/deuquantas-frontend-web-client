import { withAuthCustomer } from '@/hoc/withAuth';
import React, { useState, useEffect, useRef } from 'react';
import { CustomerLayout } from '@/layout';
import { useRouter } from 'next/router';
import { ComandaService } from '@/services/comanda.service';
import { useAuth } from '@/contexts/AuthContext';
import QrCodeInput from '@/components/InputQrCode';
import { toast } from 'react-hot-toast';
import { mesaService, SolicitacaoMesa } from '@/services/mesa.service';
import LoadingLottie from '@/components/LoadingLottie';
import Button from '@/components/Button';
import dynamic from 'next/dynamic';

const QrCodeScanner = dynamic(() => import('@/components/QrCodeScanner'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <LoadingLottie />
      <p style={{ marginTop: '1rem' }}>Carregando câmera...</p>
    </div>
  ),
});

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
  const [timeoutSeconds, setTimeoutSeconds] = useState<number>(300); // 5 minutos em segundos
  const [mounted, setMounted] = useState(false);

  const processarQrCode = async (qrCode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      setShowScanner(false);
      setSocketError(false);
      setTimeoutSeconds(300); // Reset para 5 minutos

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
          parseInt(mesaId),
          user.cliente.num_cpf.toString(),
        );
        setSuccessMessage(
          'Solicitação enviada. Aguardando aprovação do estabelecimento...',
        );

        // Iniciar contagem regressiva
        const countdownInterval = setInterval(() => {
          setTimeoutSeconds((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              setError('Tempo de espera excedido. Tente novamente.');
              setShowScanner(true);
              setSuccessMessage(null);
              setIsLoading(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        // Configurar timeout de 5 minutos
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          clearInterval(countdownInterval);
          setError('Tempo de espera excedido. Tente novamente.');
          setShowScanner(true);
          setSuccessMessage(null);
          setIsLoading(false);
        }, 300000); // 5 minutos
      } catch (socketErr) {
        console.error('Erro ao conectar com o socket:', socketErr);
        setSocketError(true);
        setError(
          'Erro ao conectar com o servidor. Tente novamente mais tarde.',
        );
        return;
      }
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
    // Desconectar do socket
    mesaService.disconnect();
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
            parseInt(numMesa as string),
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
    const handleAtualizacaoSolicitacao = (solicitacao: SolicitacaoMesa) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (solicitacao.status === 'aprovado') {
        console.log('[DEBUG] Solicitação aprovada');
        toast.success('Sua solicitação foi aprovada!');
        router.push(`/customer/comanda/${solicitacao.numMesa}`);
      } else if (solicitacao.status === 'rejeitado') {
        console.log('[DEBUG] Solicitação rejeitada');
        toast.error('Sua solicitação foi rejeitada');
        setShowScanner(true);
        setSuccessMessage(null);
        setIsLoading(false);
      }
    };

    mesaService.onSolicitacaoUpdate(handleAtualizacaoSolicitacao);

    return () => {
      mesaService.removeAllListeners();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      mesaService.disconnect();
    };
  }, []);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleScanError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (!mounted) {
    return (
      <CustomerLayout>
        <div className='flex items-center justify-center min-h-screen'>
          <LoadingLottie />
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        {error && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #f87171',
              color: '#b91c1c',
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
            }}
          >
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #22c55e',
              color: '#16a34a',
              padding: '0.75rem 1rem',
              borderRadius: '0.375rem',
            }}
          >
            <span>{successMessage}</span>
          </div>
        )}

        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <LoadingLottie />
            <p style={{ marginTop: '1rem' }}>
              {socketError
                ? 'Erro ao conectar com o servidor'
                : 'Processando QR Code...'}
            </p>
            {!socketError && (
              <p style={{ marginTop: '1rem' }}>
                Tempo restante: {Math.floor(timeoutSeconds / 60)}:
                {(timeoutSeconds % 60).toString().padStart(2, '0')}
              </p>
            )}
            <Button text='Cancelar' onClick={handleCancel} variant='primary' />
          </div>
        ) : showScanner ? (
          <>
            <QrCodeScanner
              onResult={processarQrCode}
              onError={handleScanError}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
              }}
            >
              <QrCodeInput onScan={processarQrCode} />
            </div>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <LoadingLottie />
            <p style={{ marginTop: '1rem' }}>
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

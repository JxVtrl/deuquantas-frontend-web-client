import { withAuthCustomer } from '@/hoc/withAuth';
import React, { useState, useEffect } from 'react';
import Layout from '@/layout';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { MesaService } from '@/services/mesa.service';
import { ComandaService } from '@/services/comanda.service';
import dynamic from 'next/dynamic';
import { Button } from '@deuquantas/components';
import { InputCodigoMesa } from '@/components/InputCodigoMesa';
import SeoHead from '@/components/SeoHead';

const QrCodeScanner = dynamic(() => import('@/components/QRCodeScanner'), {
  ssr: false,
  loading: () => (
    <div className='flex flex-col items-center justify-center h-full'>
      {/* <ConfirmLottie /> */}
      <p className='mt-4'>Carregando câmera...</p>
    </div>
  ),
});

const POLLING_INTERVAL = 5000; // 5 segundos
const MAX_POLLING_TIME = 300000; // 5 minutos

const CustomerQrCode: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(true);
  const [solicitacaoId, setSolicitacaoId] = useState<string | null>(null);
  const [timeoutSeconds, setTimeoutSeconds] = useState(300); // 5 minutos

  useEffect(() => {
    let pollingInterval: NodeJS.Timeout;
    let timeoutTimer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    const verificarStatusSolicitacao = async () => {
      if (!solicitacaoId || !user?.cliente?.num_cpf) return;

      try {
        const solicitacao =
          await MesaService.verificarStatusSolicitacao(solicitacaoId);

        console.log('SOLICITACAO', JSON.stringify(solicitacao, null, 2));

        if (solicitacao.status === 'aprovado') {
          toast.success('Solicitação aprovada!');

          console.log('user.usuario.id', user.usuario.id);

          // Buscar a comanda ativa após a aprovação
          const comanda = await ComandaService.getComandaAtivaByUsuarioId(
            user.usuario.id,
          );

          console.log('COMANDA ENCONTRADA', JSON.stringify(comanda, null, 2));

          const firstComanda = comanda?.[0];

          if (firstComanda) {
            router.push(`/conta/${firstComanda.id}`);
          } else {
            toast.error('Erro ao buscar comanda ativa');
            setError('Erro ao buscar comanda. Tente novamente.');
            setShowScanner(true);
            setSolicitacaoId(null);
            setSuccessMessage(null);
          }
        } else if (solicitacao.status === 'rejeitado') {
          toast.error('Solicitação rejeitada pelo estabelecimento');
          setError('Solicitação rejeitada. Tente novamente.');
          setShowScanner(true);
          setSolicitacaoId(null);
          setSuccessMessage(null);
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
        setError('Erro ao verificar status da solicitação');
        setShowScanner(true);
        setSolicitacaoId(null);
        setSuccessMessage(null);
      }
    };

    if (solicitacaoId) {
      // Inicia o polling
      pollingInterval = setInterval(
        verificarStatusSolicitacao,
        POLLING_INTERVAL,
      );

      // Configura o timeout
      timeoutTimer = setTimeout(() => {
        clearInterval(pollingInterval);
        clearInterval(countdownInterval);
        setError('Tempo de espera excedido. Tente novamente.');
        setShowScanner(true);
        setSolicitacaoId(null);
        setSuccessMessage(null);
      }, MAX_POLLING_TIME);

      // Inicia a contagem regressiva
      countdownInterval = setInterval(() => {
        setTimeoutSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(pollingInterval);
        clearTimeout(timeoutTimer);
        clearInterval(countdownInterval);
      };
    }
  }, [solicitacaoId, router, user]);

  const processarSolicitacao = async (num_cnpj: string, numMesa: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      setShowScanner(false);

      const disponivel = await MesaService.verificarDisponibilidadeMesa(
        num_cnpj,
        numMesa,
      );

      if (!disponivel) {
        throw new Error('Mesa não está disponível');
      }

      const solicitacao = await MesaService.solicitarMesa(
        num_cnpj,
        numMesa,
        user?.cliente?.num_cpf || '',
      );

      console.log('SOLICITACAO', JSON.stringify(solicitacao, null, 2));

      if (!solicitacao.success || !solicitacao.data?.id) {
        throw new Error('Erro ao criar solicitação');
      }

      setSolicitacaoId(solicitacao.data.id);
      setSuccessMessage(
        'Solicitação enviada. Aguardando aprovação do estabelecimento...',
      );
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Erro ao processar QR Code',
      );
      setShowScanner(true);
      setSolicitacaoId(null);
      setSuccessMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const processarQrCode = async (qrCode: string) => {
    // Validar formato do QR Code (estabelecimento:CNPJ:mesa:NUMERO)
    const partes = qrCode.split(':');
    if (
      partes.length !== 4 ||
      partes[0] !== 'estabelecimento' ||
      partes[2] !== 'mesa'
    ) {
      throw new Error('QR Code inválido');
    }

    const num_cnpj = partes[1];
    const numMesa = partes[3];

    processarSolicitacao(num_cnpj, numMesa);
  };

  const processarCodigoMesa = async (codigo: string) => {
    // Buscar mesa pelo código
    const response = await MesaService.buscarMesaPorCodigo(codigo);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Mesa não encontrada');
    }

    const mesa = response.data;

    console.log('MESA', JSON.stringify(mesa, null, 2));

    // Verificar disponibilidade da mesa
    if (mesa.status !== 'disponivel') {
      throw new Error('Mesa não está disponível');
    }

    processarSolicitacao(mesa.num_cnpj, mesa.numMesa);
  };

  const handleCancel = () => {
    if (solicitacaoId) {
      // TODO: Implementar cancelamento da solicitação no backend
      setShowScanner(true);
      setSolicitacaoId(null);
      setSuccessMessage(null);
      setTimeoutSeconds(300);
    }
    router.push('/home');
  };

  return (
    <>
      <SeoHead title='QR Code - DeuQuantas' />
      <Layout>
        <div className='flex flex-col items-center mt-[10vh] min-h-screen p-4'>
          {error && (
            <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
              {error}
            </div>
          )}

          {successMessage && (
            <div className='mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded'>
              {successMessage}
              <p className='mt-2'>
                Tempo restante: {Math.floor(timeoutSeconds / 60)}:
                {(timeoutSeconds % 60).toString().padStart(2, '0')}
              </p>
            </div>
          )}

          {isLoading ? (
            <div className='flex flex-col items-center'>
              {/* <ConfirmLottie /> */}
              <p className='mt-4'>Processando QR Code...</p>
            </div>
          ) : showScanner ? (
            <div className='w-full max-w-md'>
              <QrCodeScanner onResult={processarQrCode} onError={setError} />
              <div className='mt-4'>
                <InputCodigoMesa onCodigoCompleto={processarCodigoMesa} />
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center'>
              {/* <ConfirmLottie /> */}
              <p className='mt-4'>Aguardando resposta do estabelecimento...</p>
              <div className='mt-4'>
                <Button
                  text='Cancelar'
                  onClick={handleCancel}
                  variant='primary'
                />
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default withAuthCustomer(CustomerQrCode);

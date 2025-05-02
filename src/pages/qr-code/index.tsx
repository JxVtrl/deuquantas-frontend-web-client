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
import { useCustomerContext } from '@/contexts/CustomerContext';

const QrCodeScanner = dynamic(() => import('@/components/QRCodeScanner'), {
  ssr: false,
  loading: () => (
    <div className='flex flex-col items-center justify-center h-full'>
      {/* <ConfirmLottie /> */}
      <p className='mt-4'>Carregando câmera...</p>
    </div>
  ),
});


const CustomerQrCode: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setSolicitacaoId } = useCustomerContext();

  const processarSolicitacao = async (num_cnpj: string, numMesa: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const disponivel = await MesaService.verificarDisponibilidadeMesa(
        num_cnpj,
        numMesa,
        user?.cliente?.num_cpf || '',
      );

      if (!disponivel) {
        throw new Error('Mesa não está disponível');
      }

      const solicitacao = await MesaService.solicitarMesa(
        num_cnpj,
        numMesa,
        user?.cliente?.num_cpf || '',
      );

      if (!solicitacao.success || !solicitacao.data?.id) {
        throw new Error('Erro ao criar solicitação');
      }

      setSolicitacaoId(solicitacao.data.id);
      router.push('/home');
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Erro ao processar QR Code',
      );
      setSolicitacaoId(null);
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

    // Verificar disponibilidade da mesa
    if (mesa.status !== 'disponivel') {
      throw new Error('Mesa não está disponível');
    }

    processarSolicitacao(mesa.num_cnpj, mesa.numMesa);
  };

  return (
    <>
      <SeoHead title='QR Code - DeuQuantas' />
      <Layout>
        <div className='flex flex-col items-center mt-[10vh] min-h-screen p-4'>
          {isLoading ? (
            <div className='flex flex-col items-center'>
              <p className='mt-4'>Processando QR Code...</p>
            </div>
          ) : (
            <div className='w-full max-w-md'>
              {error ? (
                <div>
                  <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
                    {error}
                  </div>

                  <Button
                    text='Voltar para a home'
                    variant='primary'
                    onClick={() => void router.push('/home')}
                  />
                </div>
              ) : (
                <QrCodeScanner onResult={processarQrCode} onError={setError} />
              )}
              <div className='mt-4'>
                <InputCodigoMesa onCodigoCompleto={processarCodigoMesa} />
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default withAuthCustomer(CustomerQrCode);

import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useComanda } from '@/contexts/ComandaContext';
import { MaxWidthWrapper, ReceiptIcon } from '@deuquantas/components';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { currencyFormatter } from '@/utils/formatters';
import { Button } from '@deuquantas/components';
import { toast } from 'react-hot-toast';
import ComandaService, { ComandaResponse } from '@/services/comanda.service';
import { useCustomerContext } from '@/contexts/CustomerContext';
import { MesaService } from '@/services/mesa.service';

interface Solicitacao {
  id: string;
  comanda: {
    id: string;
    numero: string;
  };
  estabelecimento: {
    nome: string;
  };
  cliente: {
    id: string;
    nome: string;
  };
  status: 'PENDENTE' | 'ACEITA' | 'RECUSADA';
}

export const OpenComandas: React.FC = () => {
  const { user } = useAuth();
  const { comandasAtivas, fetchComandasAtivas, setComandaAtiva } = useComanda();
  const router = useRouter();
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);
  const { solicitacaoId } = useCustomerContext();
  const [solicitacaoAguardando, setSolicitacaoAguardando] = useState<any>(null);

  const fetchSolicitacoes = useCallback(async () => {
    try {
      if (!user?.usuario?.id) return;
      const response = await ComandaService.getSolicitacoesPendentes(
        user.usuario.id,
      );
      setSolicitacoes(response);
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
      toast.error('Erro ao buscar solicitações');
    }
  }, [user?.usuario?.id]);

  const fetchSolicitacaoAguardando = useCallback(async () => {
    if (!solicitacaoId) {
      setSolicitacaoAguardando(null);
      return;
    }
    try {
      const response =
        await MesaService.verificarStatusSolicitacao(solicitacaoId);
      setSolicitacaoAguardando(response);
    } catch (error) {
      setSolicitacaoAguardando(null);
    }
  }, [solicitacaoId]);

  const handleResponderSolicitacao = async (
    id: string,
    status: 'ACEITA' | 'RECUSADA',
  ) => {
    try {
      await ComandaService.responderSolicitacao({
        id_solicitacao: id,
        status,
      });
      toast.success(
        `Solicitação ${status === 'ACEITA' ? 'aceita' : 'recusada'} com sucesso!`,
      );
      fetchSolicitacoes();
      fetchComandasAtivas();
    } catch (error) {
      console.error('Erro ao responder solicitação:', error);
      toast.error('Erro ao responder solicitação');
    }
  };

  const handleComandaClick = async (comanda: ComandaResponse) => {
    await setComandaAtiva(comanda);
    router.push(`/conta/${comanda.id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchSolicitacoes(),
          fetchComandasAtivas(),
          fetchSolicitacaoAguardando(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Configura o polling para buscar solicitações, comandas e status da solicitação a cada 30 segundos
    const intervalId = setInterval(() => {
      fetchSolicitacoes();
      fetchComandasAtivas();
      fetchSolicitacaoAguardando();
    }, 30000);

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [
    user?.usuario?.id,
    fetchSolicitacoes,
    fetchComandasAtivas,
    fetchSolicitacaoAguardando,
  ]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <MaxWidthWrapper
      style={{
        padding: '0 0 20px',
      }}
    >
      <div className='flex flex-col gap-4'>
        {/* Card de Aguardando Aprovação */}
        {solicitacaoAguardando &&
          solicitacaoAguardando.status === 'pendente' && (
            <Card className='p-4 bg-yellow-50 border border-yellow-300 mb-4'>
              <div className='flex flex-col items-center'>
                <h2 className='text-lg font-semibold text-yellow-800 mb-2'>
                  Aguardando aprovação do estabelecimento
                </h2>
                <p className='text-yellow-700'>
                  Sua solicitação para a mesa #{solicitacaoAguardando.numMesa}{' '}
                  está aguardando aprovação.
                </p>
                {/* Botão de cancelar pode ser implementado aqui se desejar */}
              </div>
            </Card>
          )}
        {/* Seção de Solicitações Pendentes */}
        {solicitacoes?.length > 0 && (
          <div>
            <div className='flex items-center justify-between mb-2'>
              <h2 className='text-lg font-semibold'>Solicitações Pendentes</h2>
              <span className='px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm'>
                {solicitacoes.length}{' '}
                {solicitacoes.length === 1 ? 'solicitação' : 'solicitações'}
              </span>
            </div>
            <Card className='p-4 bg-white'>
              <div className='flex flex-col gap-4'>
                {solicitacoes.map((solicitacao, index) => (
                  <div
                    key={index}
                    className='grid grid-cols-[1fr_auto] gap-4 border-b last:border-b-0 pb-4 last:pb-0'
                  >
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-center gap-2'>
                        <p className='font-medium text-[14px]'>
                          {solicitacao.estabelecimento.nome}
                        </p>
                        <span className='px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs'>
                          Mesa #{solicitacao.comanda.id}
                        </span>
                      </div>
                      <p className='text-sm text-gray-600'>
                        {solicitacao.cliente.nome} convidou você para participar
                        desta comanda
                      </p>
                    </div>
                    <div className='grid grid-cols-[1fr_1fr] gap-2'>
                      <Button
                        variant='primary'
                        text='Aceitar'
                        onClick={(e: React.FormEvent<Element>) => {
                          e.preventDefault();
                          handleResponderSolicitacao(solicitacao.id, 'ACEITA');
                        }}
                      />
                      <Button
                        variant='secondary'
                        text='Recusar'
                        onClick={(e: React.FormEvent<Element>) => {
                          e.preventDefault();
                          handleResponderSolicitacao(
                            solicitacao.id,
                            'RECUSADA',
                          );
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Seção de Comandas Ativas */}
        {comandasAtivas.length > 0 ? (
          <div>
            <div className='flex items-center justify-between mb-2'>
              <h2 className='text-lg font-semibold'>Comandas Ativas</h2>
              <span className='px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm'>
                {comandasAtivas.length}{' '}
                {comandasAtivas.length === 1 ? 'comanda' : 'comandas'}
              </span>
            </div>
            <div className='flex flex-col gap-2'>
              {comandasAtivas.map((comanda) => {
                console.log(comanda);
                // Soma do valor já pago por todos
                const valorPago =
                  comanda.clientes?.reduce(
                    (acc, cliente) => acc + (Number(cliente.valor_pago) || 0),
                    0,
                  ) || 0;

                const valorTotal = (comanda?.conta?.valTotal || 0) - valorPago;

                return (
                  <Card
                    key={comanda.id}
                    className='p-4 cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.98] bg-white'
                    onClick={() => handleComandaClick(comanda)}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center gap-2'>
                        <div className='p-2 bg-[#F5F5F5] rounded-full'>
                          <ReceiptIcon />
                        </div>
                        <div>
                          <h2 className='text-[14px] font-[600] text-[#272727] leading-[24px]'>
                            {comanda.estabelecimento?.nome ||
                              'Estabelecimento não encontrado'}
                          </h2>
                          <div className='flex items-center gap-2'>
                            <p className='text-[12px] font-[400] text-[#666666] leading-[20px]'>
                              Mesa {comanda.numMesa}
                            </p>
                            <span className='w-1 h-1 bg-gray-300 rounded-full'></span>
                            <p className='text-[12px] font-[400] text-[#666666] leading-[20px]'>
                              {comanda.clientes?.length || 0}{' '}
                              {comanda.clientes?.length === 1
                                ? 'pessoa'
                                : 'pessoas'}
                            </p>
                            <span className='w-1 h-1 bg-gray-300 rounded-full'></span>
                            <p className='text-[12px] font-[400] text-[#666666] leading-[20px]'>
                              {comanda.itens.length}{' '}
                              {comanda.itens.length === 1 ? 'item' : 'itens'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='text-[14px] font-[600] text-[#272727] leading-[20px]'>
                          {currencyFormatter(valorTotal)}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            <h2 className='text-[16px] font-[500] text-black leading-[24px]'>
              Seja Bem-vindo, <strong>{user?.usuario.name}</strong>
            </h2>
            <span className='text-[14px] font-[500] text-black leading-[24px]'>
              Você ainda não está listado em nenhum estabelecimento.
            </span>
          </div>
        )}
      </div>
    </MaxWidthWrapper>
  );
};

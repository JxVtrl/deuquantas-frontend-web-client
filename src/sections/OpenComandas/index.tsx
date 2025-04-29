import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useComanda } from '@/contexts/ComandaContext';
import { MaxWidthWrapper, ReceiptIcon } from '@deuquantas/components';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { currencyFormatter } from '@/utils/formatters';
import { Button } from '@deuquantas/components';
import { toast } from 'react-hot-toast';
import ComandaService from '@/services/comanda.service';

interface Solicitacao {
  id: string;
  comanda: {
    id: string;
    numero: string;
  };
  estabelecimento: {
    nome: string;
  };
  status: 'PENDENTE' | 'ACEITA' | 'RECUSADA';
}

export const OpenComandas: React.FC = () => {
  const { user } = useAuth();
  const { fetchComandaAtiva, comanda, estabelecimento } = useComanda();
  const router = useRouter();
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  }, [user?.usuario?.id]);

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
      fetchComandaAtiva();
    } catch (error) {
      console.error('Erro ao responder solicitação:', error);
      toast.error('Erro ao responder solicitação');
    }
  };

  useEffect(() => {
    fetchSolicitacoes();
    fetchComandaAtiva();

    // Configura o polling para buscar solicitações a cada 30 segundos
    const intervalId = setInterval(() => {
      fetchSolicitacoes();
      fetchComandaAtiva();
    }, 30000);

    // Limpa o intervalo quando o componente for desmontado
    return () => clearInterval(intervalId);
  }, [user?.usuario?.id, fetchComandaAtiva, fetchSolicitacoes]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <MaxWidthWrapper
      style={{
        padding: '0 0 20px',
      }}
    >
      {solicitacoes?.length > 0 ? (
        <Card className='p-4 cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.98] bg-white'>
          {solicitacoes.map((solicitacao, index) => {
            return (
              <div key={index} className='grid grid-cols-[1fr_auto] gap-4'>
                <div className='flex flex-col gap-1'>
                  <p className='font-medium'>
                    {solicitacao.estabelecimento.nome}
                  </p>
                  <p className='text-sm text-gray-600'>
                    Comanda #{solicitacao.comanda.numero}
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
                      handleResponderSolicitacao(solicitacao.id, 'RECUSADA');
                    }}
                  />
                </div>
              </div>
            );
          })}
        </Card>
      ) : comanda ? (
        <Card
          className='p-4 cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-[0.98] bg-white'
          onClick={() => {
            if (comanda) {
              router.push(`/conta/${comanda.id}`);
            }
          }}
        >
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-2'>
              <div className='p-2 bg-[#F5F5F5] rounded-full'>
                <ReceiptIcon />
              </div>
              <div>
                <h2 className='text-[14px] font-[600] text-[#272727] leading-[24px]'>
                  {estabelecimento?.nome_estab}
                </h2>
                <p className='text-[12px] font-[400] text-[#666666] leading-[20px]'>
                  Mesa {comanda.numMesa}
                </p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-[14px] font-[600] text-[#272727] leading-[20px]'>
                {currencyFormatter(comanda.conta?.valTotal || 0)}
              </p>
              <p className='text-[12px] font-[400] text-[#666666] leading-[16px]'>
                {comanda.itens.length}{' '}
                {comanda.itens.length === 1 ? 'item' : 'itens'}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h2 className='text-[16px] font-[500] text-black leading-[24px]'>
            Seja Bem-vindo, <strong>{user?.usuario.name}</strong>
          </h2>
          <span className='text-[14px] font-[500] text-black leading-[24px]'>
            Você ainda não está listado em nenhum estabelecimento.
          </span>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { mesaService, MesaSolicitacao } from '@/services/mesa.service';
import EstablishmentLayout from '@/layout/EstablishmentLayout';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { withAuthEstablishment } from '@/hoc/withAuth';

const SolicitacoesManagement = () => {
  const { user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState<MesaSolicitacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.estabelecimento?.num_cnpj) {
      fetchSolicitacoes();
      // Entrar na sala do estabelecimento
      mesaService.joinRoom(user.estabelecimento.num_cnpj);
    }
  }, [user?.estabelecimento?.num_cnpj]);

  const fetchSolicitacoes = async () => {
    try {
      setLoading(true);
      if (user?.estabelecimento?.num_cnpj) {
        const response = await api.get(
          `/mesas/solicitacoes/${user.estabelecimento.num_cnpj}`,
        );
        setSolicitacoes(
          Array.isArray(response.data.data) ? response.data.data : [],
        );
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar solicitações');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleNovaSolicitacao = (solicitacao: MesaSolicitacao) => {
      console.log('Nova solicitação recebida:', solicitacao);
      setSolicitacoes((prev) => [solicitacao, ...prev]);
      toast.success('Nova solicitação de mesa recebida!');
    };

    const handleSolicitacaoAtualizada = (solicitacao: MesaSolicitacao) => {
      console.log('Solicitação atualizada:', solicitacao);
      setSolicitacoes((prev) =>
        prev.map((s) =>
          s.id === solicitacao.id ? { ...s, status: solicitacao.status } : s,
        ),
      );
    };

    mesaService.onNovaSolicitacao(handleNovaSolicitacao);
    mesaService.onSolicitacaoAtualizada(handleSolicitacaoAtualizada);

    return () => {
      mesaService.removerListeners();
    };
  }, []);

  const handleAprovar = async (solicitacaoId: string) => {
    try {
      await mesaService.aprovarSolicitacao(solicitacaoId);
      toast.success('Solicitação aprovada com sucesso');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao aprovar solicitação');
    }
  };

  const handleRejeitar = async (solicitacaoId: string) => {
    try {
      await mesaService.rejeitarSolicitacao(solicitacaoId);
      toast.success('Solicitação rejeitada com sucesso');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao rejeitar solicitação');
    }
  };

  return (
    <EstablishmentLayout>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold mb-6'>Solicitações de Mesas</h1>

        {loading ? (
          <div className='flex justify-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFCC00]'></div>
          </div>
        ) : solicitacoes.length === 0 ? (
          <p className='text-center text-gray-500'>
            Nenhuma solicitação pendente
          </p>
        ) : (
          <div className='grid gap-4'>
            {solicitacoes.map((solicitacao) => (
              <div
                key={solicitacao.id}
                className='bg-white p-4 rounded-lg shadow'
              >
                <div className='flex justify-between items-center'>
                  <div>
                    <p className='font-semibold'>Mesa {solicitacao.numMesa}</p>
                    <p className='text-sm text-gray-500'>
                      Cliente: {solicitacao.clienteId}
                    </p>
                    <p className='text-sm text-gray-500'>
                      Data:{' '}
                      {new Date(solicitacao.dataSolicitacao).toLocaleString()}
                    </p>
                  </div>
                  <div className='flex gap-2'>
                    {solicitacao.status === 'pendente' ? (
                      <>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleAprovar(solicitacao.id)}
                        >
                          <Check className='h-4 w-4 mr-2' />
                          Aprovar
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => handleRejeitar(solicitacao.id)}
                        >
                          <X className='h-4 w-4 mr-2' />
                          Rejeitar
                        </Button>
                      </>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          solicitacao.status === 'aprovado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {solicitacao.status === 'aprovado'
                          ? 'Aprovado'
                          : 'Rejeitado'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </EstablishmentLayout>
  );
};

export default withAuthEstablishment(SolicitacoesManagement);

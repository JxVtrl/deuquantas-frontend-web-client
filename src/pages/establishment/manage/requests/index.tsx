import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mesaService, SolicitacaoMesa } from '@/services/mesa.service';
import { toast } from 'react-hot-toast';
import { Check, X } from 'lucide-react';
import EstablishmentLayout from '@/layout/EstablishmentLayout';
import { Button } from '@/components/ui/button';
import { withAuthEstablishment } from '@/hoc/withAuth';

const SolicitacoesManagement = () => {
  const { user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoMesa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.estabelecimento?.num_cnpj) return;

    const roomName = `estabelecimento:${user.estabelecimento.num_cnpj}`;
    console.log('[DEBUG] Página de solicitações - Room:', roomName);

    // Carregar solicitações iniciais
    const loadInitialRequests = async () => {
      try {
        const response = await mesaService.joinRoom(roomName);
        console.log('[DEBUG] Solicitações iniciais:', response.solicitacoes);
        setSolicitacoes(response.solicitacoes || []);
      } catch (error) {
        console.error('[DEBUG] Erro ao carregar solicitações:', error);
        toast.error('Erro ao carregar solicitações');
      } finally {
        setLoading(false);
      }
    };

    // Registrar listeners para eventos de solicitações
    const novaSolicitacaoListener = (solicitacao: SolicitacaoMesa) => {
      console.log('[DEBUG] Nova solicitação recebida:', solicitacao);
      setSolicitacoes((prev) => {
        // Evita duplicatas
        if (prev.some((s) => s.id === solicitacao.id)) {
          return prev;
        }
        return [...prev, solicitacao];
      });
      toast.success('Nova solicitação recebida!');
    };

    const solicitacaoUpdateListener = (solicitacao: SolicitacaoMesa) => {
      console.log('[DEBUG] Solicitação atualizada:', solicitacao);
      setSolicitacoes((prev) =>
        prev.map((s) => (s.id === solicitacao.id ? solicitacao : s)),
      );
    };

    // Primeiro registra os listeners
    mesaService.onNovaSolicitacao(novaSolicitacaoListener);
    mesaService.onSolicitacaoUpdate(solicitacaoUpdateListener);

    // Depois carrega as solicitações iniciais
    loadInitialRequests();

    return () => {
      console.log('[DEBUG] Desmontando componente de solicitações');
      mesaService.removeAllListeners();
    };
  }, [user?.estabelecimento?.num_cnpj]);

  const handleAprovar = async (id: string) => {
    try {
      await mesaService.aprovarSolicitacao(id);
      toast.success('Solicitação aprovada com sucesso!');
    } catch (error) {
      console.error('Erro ao aprovar solicitação:', error);
      toast.error('Erro ao aprovar solicitação');
    }
  };

  const handleRejeitar = async (id: string) => {
    try {
      await mesaService.rejeitarSolicitacao(id);
      toast.success('Solicitação rejeitada com sucesso!');
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
      toast.error('Erro ao rejeitar solicitação');
    }
  };

  if (loading) {
    return (
      <EstablishmentLayout>
        <div className='flex flex-col items-center justify-center h-full'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFCC00]'></div>
          <p className='mt-4 text-gray-600'>Carregando solicitações...</p>
        </div>
      </EstablishmentLayout>
    );
  }

  if (solicitacoes.length === 0) {
    return (
      <EstablishmentLayout>Nenhuma solicitação encontrada</EstablishmentLayout>
    );
  }

  return (
    <EstablishmentLayout>
      <div className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-4'>Solicitações de Mesa</h1>
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
                {solicitacao.status === 'pendente' && (
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => handleAprovar(solicitacao.id)}
                    >
                      <Check className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => handleRejeitar(solicitacao.id)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </EstablishmentLayout>
  );
};

export default withAuthEstablishment(SolicitacoesManagement);

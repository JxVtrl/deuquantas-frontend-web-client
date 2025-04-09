import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { mesaService, MesaSolicitacao } from '@/services/mesa.service';
import { withAuthEstablishment } from '@/hoc/withAuth';
import { Check, X } from 'lucide-react';
import EstablishmentLayout from '@/layout/EstablishmentLayout';
import { Button } from '@/components/ui/button';

const SolicitacoesManagement = () => {
  const router = useRouter();
  const { cnpj } = router.query;
  const [solicitacoes, setSolicitacoes] = useState<MesaSolicitacao[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const setupSocket = async () => {
      try {
        console.log('[DEBUG] Iniciando setup do socket');
        // O socket já é inicializado automaticamente ao importar o serviço
        console.log('[DEBUG] Socket inicializado');

        // Aguardar um pouco para garantir que o socket esteja conectado
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (cnpj) {
          console.log('[DEBUG] Tentando entrar na sala:', cnpj);
          await mesaService.joinRoom(cnpj as string);
          console.log('[DEBUG] Entrou na sala com sucesso');

          // Configurar listeners após entrar na sala
          mesaService.onNovaSolicitacao((solicitacao: MesaSolicitacao) => {
            console.log('[DEBUG] Nova solicitação recebida:', solicitacao);
            setSolicitacoes((prev) => [...prev, solicitacao]);
          });

          mesaService.onSolicitacaoAtualizada(
            (solicitacao: MesaSolicitacao) => {
              console.log('[DEBUG] Solicitação atualizada:', solicitacao);
              setSolicitacoes((prev) =>
                prev.map((s) => (s.id === solicitacao.id ? solicitacao : s)),
              );
            },
          );
        }
      } catch (error) {
        console.error('[DEBUG] Erro ao configurar socket:', error);
        setError(
          'Erro ao conectar com o servidor. Tente novamente mais tarde.',
        );
      }
    };

    setupSocket();

    return () => {
      console.log('[DEBUG] Limpando listeners do socket');
      mesaService.removeAllListeners();
    };
  }, [cnpj]);

  const handleAprovar = async (id: string) => {
    try {
      console.log('[DEBUG] Aprovando solicitação:', id);
      await mesaService.aprovarSolicitacao(id);
      toast.success('Solicitação aprovada com sucesso');
    } catch (error) {
      console.error('[DEBUG] Erro ao aprovar solicitação:', error);
      toast.error('Erro ao aprovar solicitação');
    }
  };

  const handleRejeitar = async (id: string) => {
    try {
      console.log('[DEBUG] Rejeitando solicitação:', id);
      await mesaService.rejeitarSolicitacao(id);
      toast.success('Solicitação rejeitada com sucesso');
    } catch (error) {
      console.error('[DEBUG] Erro ao rejeitar solicitação:', error);
      toast.error('Erro ao rejeitar solicitação');
    }
  };

  console.log('[DEBUG] Renderizando com solicitacoes:', solicitacoes);

  return (
    <EstablishmentLayout>
      <div className='container mx-auto p-4'>
        <h1 className='text-2xl font-bold mb-4'>Solicitações de Mesa</h1>
        {error ? (
          <p className='text-red-500'>{error}</p>
        ) : solicitacoes.length === 0 ? (
          <p className='text-gray-500'>Nenhuma solicitação pendente</p>
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

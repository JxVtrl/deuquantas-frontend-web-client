import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SolicitacaoMesa, mesaService } from '@/services/mesa.service';
import { Loader2 } from 'lucide-react';

interface MesaAguardandoAprovacaoProps {
  isOpen: boolean;
  onClose: () => void;
  solicitacao: {
    num_cnpj: string;
    numMesa: string;
    clienteId: string;
  };
}

export const MesaAguardandoAprovacao: React.FC<
  MesaAguardandoAprovacaoProps
> = ({ isOpen, onClose, solicitacao }) => {
  const [status, setStatus] = useState<'pendente' | 'aprovado' | 'rejeitado'>(
    'pendente',
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Solicitar a mesa
      mesaService.solicitarMesa(
        solicitacao.num_cnpj,
        parseInt(solicitacao.numMesa),
        solicitacao.clienteId,
      );

      // Ouvir atualizações da solicitação
      const handleAtualizacao = (solicitacao: SolicitacaoMesa) => {
        setStatus(solicitacao.status);
        setLoading(false);

        // Se a solicitação for aprovada ou rejeitada, fechar o modal após 3 segundos
        if (solicitacao.status !== 'pendente') {
          setTimeout(() => {
            onClose();
          }, 3000);
        }
      };

      mesaService.onSolicitacaoUpdate(handleAtualizacao);

      return () => {
        mesaService.removeAllListeners();
      };
    }
  }, [isOpen, solicitacao, onClose]);

  const getStatusMessage = () => {
    switch (status) {
      case 'pendente':
        return 'Aguardando aprovação do estabelecimento...';
      case 'aprovado':
        return 'Mesa aprovada! Redirecionando...';
      case 'rejeitado':
        return 'Solicitação rejeitada pelo estabelecimento.';
      default:
        return '';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'pendente':
        return 'text-yellow-500';
      case 'aprovado':
        return 'text-green-500';
      case 'rejeitado':
        return 'text-red-500';
      default:
        return '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <div className='flex flex-col items-center justify-center p-6'>
          {loading ? (
            <div className='flex flex-col items-center gap-4'>
              <Loader2 className='h-8 w-8 animate-spin text-yellow-500' />
              <p className='text-center text-gray-600'>
                Aguardando resposta do estabelecimento...
              </p>
            </div>
          ) : (
            <div className='flex flex-col items-center gap-4'>
              <div className={`text-2xl font-semibold ${getStatusColor()}`}>
                {getStatusMessage()}
              </div>
              {status === 'pendente' && (
                <div className='text-sm text-gray-500'>
                  Por favor, aguarde enquanto o estabelecimento analisa sua
                  solicitação.
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

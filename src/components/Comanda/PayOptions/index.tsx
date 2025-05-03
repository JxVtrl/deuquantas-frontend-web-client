import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useComanda } from '@/contexts/ComandaContext';
import { api } from '@/lib/axios';
import { MaxWidthWrapper } from '@deuquantas/components';
import { currencyFormatter } from '@/utils/formatters';
import { useAuth } from '@/contexts/AuthContext';
import { ComandaPessoa } from '@/services/comanda.service';

interface PaymentResponse {
  success: boolean;
  message: string;
  valorPago: number;
  dataPagamento: Date;
}

type PaymentOption = 'individual' | 'total' | 'split';

interface PaymentConfirmation {
  show: boolean;
  option?: PaymentOption;
  title: string;
  message: string;
  value?: number;
}

export const ComandaPayOptions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<PaymentConfirmation>({
    show: false,
    title: '',
    message: '',
  });
  const router = useRouter();
  const { comanda, fetchComanda } = useComanda();
  const { user } = useAuth();
  const [isSplitting, setIsSplitting] = useState(false);

  useEffect(() => {
    if (
      comanda?.clientes?.some(
        (cliente) => cliente.status === 'aguardando_split',
      )
    ) {
      setIsSplitting(true);
    }
  }, [comanda]);

  const getConfirmationDetails = (option: PaymentOption) => {
    if (!comanda?.conta)
      return {
        title: '',
        message: 'Erro ao carregar detalhes da comanda',
        value: 0,
      };

    const valorTotal = comanda.conta.valTotal;
    const totalClientes = comanda.clientes.length;

    switch (option) {
      case 'individual':
        // Busca o valor individual do usuário logado
        const clienteAtual = comanda.clientes.find(
          (cliente) => cliente.id === user?.cliente.id,
        );
        const valorIndividual = clienteAtual?.valor_total || 0;
        return {
          title: 'Confirmar Pagamento Individual',
          message:
            'Você está prestes a pagar apenas o seu consumo. O valor será calculado com base nos seus pedidos.',
          value: valorIndividual,
        };
      case 'total':
        return {
          title: 'Confirmar Pagamento Total',
          message: `Você está prestes a pagar o valor total da comanda (${currencyFormatter(valorTotal)}). Deseja continuar?`,
          value: valorTotal,
        };
      case 'split':
        const valorPorPessoa = valorTotal / totalClientes;
        return {
          title: 'Confirmar Divisão da Conta',
          message: `Você está prestes a dividir a conta igualmente entre ${totalClientes} pessoas. Cada pessoa pagará ${currencyFormatter(valorPorPessoa)}. Deseja continuar?`,
          value: valorPorPessoa,
        };
    }
  };

  const handlePaymentOptionClick = (option: PaymentOption) => {
    const details = getConfirmationDetails(option);
    setConfirmation({
      show: true,
      option,
      title: details.title,
      message: details.message,
      value: details.value,
    });
  };

  const handleStartSplit = async () => {
    if (!comanda) return;
    setLoading(true);
    setError(null);

    try {
      await api.post(`/comandas/${comanda.id}/iniciar-split`);
      if (fetchComanda) {
        await fetchComanda(comanda.id);
      }
      setConfirmation((prev) => ({ ...prev, show: false }));
      setIsOpen(false);
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          'Ocorreu um erro ao iniciar a divisão. Tente novamente.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!comanda || !confirmation.option) return;

    setLoading(true);
    setError(null);

    try {
      // Redireciona para a página de pagamento, passando id_comanda e valor
      router.push({
        pathname: '/conta/pagamento',
        query: {
          id_comanda: comanda.id,
          valor: confirmation.value,
        },
      });
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          'Ocorreu um erro ao processar o pagamento. Tente novamente.',
      );
    } finally {
      setLoading(false);
      setConfirmation((prev) => ({ ...prev, show: false }));
    }
  };

  if (!comanda) return null;

  // Identifica o criador da comanda (primeira pessoa da lista)
  const criadorId = comanda.clientes?.[0]?.id;
  const meuStatus = comanda.clientes?.find(
    (cliente) => cliente.id === user?.usuario.id,
  )?.status as ComandaPessoa['status'];
  const todosAtivos = comanda.clientes?.every(
    (cliente) => cliente.status === 'ativo',
  );
  const todosAguardandoSplit = comanda.clientes?.every(
    (cliente) => cliente.status === 'aguardando_split',
  );

  // Lógica de exibição dos botões
  let opcoes: PaymentOption[] = [];
  if (meuStatus === 'pago') {
    // Não mostra nenhum botão se já pagou
    opcoes = [];
  } else if (todosAtivos) {
    // Só o criador pode ver todas as opções
    if (user?.usuario.id === criadorId) {
      opcoes = ['individual', 'total', 'split'];
    } else {
      opcoes = ['individual', 'total'];
    }
  } else if (todosAguardandoSplit) {
    // Após split, só quem está aguardando_split pode pagar sua parte
    if (meuStatus === 'aguardando_split') {
      opcoes = ['split'];
    }
  } else {
    // Pagamento individual liberado para quem está ativo
    if (meuStatus === 'ativo') {
      opcoes = ['individual'];
    }
  }

  const isAlone = comanda.clientes.length === 1;

  return (
    <MaxWidthWrapper
      style={{
        paddingTop: '20px',
        paddingBottom: '81px',
      }}
    >
      <button
        onClick={() => {
          if (isAlone) {
            handlePaymentOptionClick('individual');
          } else if (isSplitting) {
            handlePaymentOptionClick('split');
          } else {
            setIsOpen(true);
          }
        }}
        className='w-full py-3 bg-[#FFCC00] text-black font-semibold rounded-lg hover:bg-[#E6B800] transition-colors'
        disabled={loading}
      >
        {loading
          ? 'Processando...'
          : isAlone
            ? 'Pagar meu consumo'
            : isSplitting
              ? 'Pagar minha parte'
              : 'Opções de Pagamento'}
      </button>

      {/* Modal de Opções de Pagamento */}
      {isOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40'>
          <div className='bg-white rounded-lg w-full max-w-md'>
            <div className='p-6'>
              <h3 className='text-xl font-semibold mb-4'>
                Como você deseja pagar?
              </h3>

              {error && (
                <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
                  {error}
                </div>
              )}

              <div className='space-y-3'>
                {opcoes.includes('individual') && (
                  <button
                    onClick={() => handlePaymentOptionClick('individual')}
                    className='w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-left px-4 font-medium disabled:opacity-50'
                    disabled={loading}
                  >
                    Pagar meu consumo
                  </button>
                )}
                {opcoes.includes('total') && (
                  <button
                    onClick={() => handlePaymentOptionClick('total')}
                    className='w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-left px-4 font-medium disabled:opacity-50'
                    disabled={loading}
                  >
                    Pagar o valor total
                  </button>
                )}
                {opcoes.includes('split') && (
                  <button
                    onClick={() => handlePaymentOptionClick('split')}
                    className='w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-left px-4 font-medium disabled:opacity-50'
                    disabled={loading}
                  >
                    Dividir a conta igualmente
                  </button>
                )}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className='mt-4 w-full py-3 border border-gray-300 rounded-lg text-gray-700 font-medium disabled:opacity-50'
                disabled={loading}
              >
                Cancelar
              </button>

              {loading && (
                <div className='mt-4 flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-[#FFCC00]'></div>
                  <span className='ml-2'>Processando pagamento...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação */}
      {confirmation.show && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='bg-white rounded-lg w-full max-w-md'>
            <div className='p-6'>
              <h3 className='text-xl font-semibold mb-4'>
                {confirmation.title}
              </h3>

              <p className='text-gray-600 mb-6'>{confirmation.message}</p>

              <div className='space-y-3'>
                <button
                  onClick={() => {
                    if (
                      confirmation.option === 'split' &&
                      user?.usuario.id === criadorId &&
                      comanda.clientes?.some((c) => c.status === 'ativo')
                    ) {
                      // Criador inicia o split
                      handleStartSplit();
                    } else {
                      // Participante paga, ou criador paga após todos pagarem
                      handleConfirmPayment();
                    }
                  }}
                  className='w-full py-3 bg-[#FFCC00] text-black font-semibold rounded-lg hover:bg-[#E6B800] transition-colors disabled:opacity-50'
                  disabled={loading}
                >
                  Confirmar Pagamento
                </button>

                <button
                  onClick={() =>
                    setConfirmation((prev) => ({ ...prev, show: false }))
                  }
                  className='w-full py-3 border border-gray-300 rounded-lg text-gray-700 font-medium disabled:opacity-50'
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>

              {loading && (
                <div className='mt-4 flex items-center justify-center'>
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-[#FFCC00]'></div>
                  <span className='ml-2'>Processando pagamento...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </MaxWidthWrapper>
  );
};

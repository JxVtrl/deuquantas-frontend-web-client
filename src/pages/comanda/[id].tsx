import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/axios';
import { CustomerLayout } from '@/layout';
import { withAuthCustomer } from '@/hoc/withAuth';
import { currencyFormatter, timeFormatter } from '@/utils/formatters';

interface ComandaItem {
  id: string;
  quantidade: number;
  valor_total: number;
  item: {
    nome: string;
    descricao: string;
    preco: number;
  };
}

interface Conta {
  id: string;
  valConta: number;
  datConta: string;
  codFormaPg: number;
  horPagto?: string;
}

interface Comanda {
  id: string;
  numMesa: string;
  data_criacao: string;
  status: string;
  itens: ComandaItem[];
  conta?: Conta;
  valor_total: number;
}

const ComandaPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [comanda, setComanda] = useState<Comanda | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchComanda = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/comandas/${id}`);

        console.log('response', response.data);

        // Verifica se a comanda pertence ao usuário logado
        if (!response.data) {
          throw new Error('Comanda não encontrada');
        }

        setComanda(response.data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro ao carregar comanda';
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchComanda();
  }, [id]);

  if (loading) {
    return (
      <CustomerLayout>
        <div className='flex justify-center items-center h-screen'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFCC00]'></div>
        </div>
      </CustomerLayout>
    );
  }

  if (error || !comanda) {
    return (
      <CustomerLayout>
        <div className='flex justify-center items-center h-screen'>
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            {error}
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold mb-6'>Comanda #{comanda.id}</h1>

        <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
          <div className='mb-4'>
            <p className='text-gray-600'>Mesa:</p>
            <p className='font-semibold'>{comanda.numMesa}</p>
          </div>
          <div className='mb-4'>
            <p className='text-gray-600'>Data:</p>
            <p className='font-semibold'>
              {timeFormatter(comanda.data_criacao)}
            </p>
          </div>
          <div className='mb-4'>
            <p className='text-gray-600'>Status:</p>
            <p className='font-semibold'>{comanda.status}</p>
          </div>

          <div className='mt-6'>
            <h2 className='text-xl font-semibold mb-4'>Itens</h2>
            <div className='space-y-4'>
              {comanda.itens.map((item) => (
                <div
                  key={item.id}
                  className='flex justify-between items-center border-b pb-2'
                >
                  <div>
                    <p className='font-medium'>{item.item.nome}</p>
                    <p className='text-sm text-gray-600'>
                      {item.quantidade}x {currencyFormatter(item.item.preco)}
                    </p>
                  </div>
                  <p className='font-semibold'>
                    {currencyFormatter(item.valor_total)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className='mt-6'>
            {comanda.conta ? (
              <div className='bg-gray-50 p-4 rounded-lg'>
                <h2 className='text-xl font-semibold mb-4'>Conta</h2>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Valor Total:</span>
                    <span className='font-semibold'>
                      {currencyFormatter(comanda.conta.valConta)}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Data:</span>
                    <span>{timeFormatter(comanda.conta.datConta)}</span>
                  </div>
                  {comanda.conta.horPagto && (
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Hora do Pagamento:</span>
                      <span>{timeFormatter(comanda.conta.horPagto)}</span>
                    </div>
                  )}
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Forma de Pagamento:</span>
                    <span>Código: {comanda.conta.codFormaPg}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className='flex justify-between items-center text-xl font-bold mt-4'>
                <span>Total</span>
                <span>{currencyFormatter(comanda.valor_total)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default withAuthCustomer(ComandaPage);

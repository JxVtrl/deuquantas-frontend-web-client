import React, { useEffect, useState } from 'react';
import Layout from '@/layout';
import { useAuth } from '@/contexts/AuthContext';
import { ComandaService, ComandaResponse } from '@/services/comanda.service';
import { MaxWidthWrapper } from '@deuquantas/components';
import { withAuthCustomer } from '@/hoc/withAuth';
import { currencyFormatter } from '@/utils/formatters';

const statusColors: Record<string, string> = {
  finalizado: 'bg-green-100 text-green-800',
  ativo: 'bg-yellow-100 text-yellow-800',
};

const OrdersPage = () => {
  const { user } = useAuth();
  const [comandas, setComandas] = useState<ComandaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.usuario?.id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await ComandaService.getComandasFinalizadas(
          user.usuario.id,
        );
        setComandas(data);
      } catch (err: any) {
        setError('Erro ao buscar histórico de comandas.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.usuario?.id]);

  return (
    <Layout>
      <MaxWidthWrapper
        styleContent={{
          paddingTop: '20px',
          paddingBottom: '81px',
        }}
      >
        <h1 className='text-3xl font-extrabold mb-8 text-center text-gray-800'>
          Histórico de Comandas
        </h1>
        {loading && <div className='text-center'>Carregando...</div>}
        {error && <div className='text-red-600 text-center'>{error}</div>}
        {!loading && !error && comandas.length === 0 && (
          <div className='text-center text-gray-500'>
            Nenhuma comanda finalizada encontrada.
          </div>
        )}
        <div className='grid gap-8'>
          {comandas
            .sort(
              (a, b) =>
                new Date(b.conta?.data_criacao || '').getTime() -
                new Date(a.conta?.data_criacao || '').getTime(),
            )
            .map((comanda) => (
              <div
                key={comanda.id}
                className='rounded-xl shadow-lg border border-gray-100 bg-white p-6 flex flex-col gap-3 hover:shadow-2xl transition-shadow'
              >
                <div className='flex items-center justify-between'>
                  <div className='text-lg font-bold text-gray-700'>
                    {comanda.estabelecimento?.nome || 'Estabelecimento'}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[comanda.status] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {comanda.status}
                  </span>
                </div>
                <div className='text-sm text-gray-500 mb-1'>
                  Data:{' '}
                  {comanda.conta?.data_fechamento
                    ? new Date(comanda.conta.data_fechamento).toLocaleString()
                    : '-'}
                </div>
                <div>
                  <div className='font-semibold text-gray-700 mb-1'>
                    Itens pedidos:
                  </div>
                  <ul className='divide-y divide-gray-100'>
                    {comanda.itens.map((pedido, idx) => {
                      if ('item' in pedido) {
                        return (
                          <li
                            key={idx}
                            className='py-1 flex items-center justify-between'
                          >
                            <span className='text-gray-600'>
                              {pedido.item.nome}
                            </span>
                            <span className='text-gray-800 font-medium'>
                              {currencyFormatter(pedido.item.preco)}
                            </span>
                          </li>
                        );
                      } else {
                        return (
                          <li
                            key={idx}
                            className='py-1 flex items-center justify-between'
                          >
                            <span className='text-gray-600'>{pedido.nome}</span>
                            <span className='text-gray-800 font-medium'>
                              {currencyFormatter(pedido.preco)}
                            </span>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
                <div>
                  <div className='font-semibold text-gray-700 mb-1 mt-2'>
                    Pessoas na comanda:
                  </div>
                  <ul className='flex flex-wrap gap-3'>
                    {comanda.clientes.map((cliente) => (
                      <li
                        key={cliente.id}
                        className='flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1'
                      >
                        {cliente.avatar && (
                          <img
                            src={cliente.avatar}
                            alt={cliente.nome}
                            className='w-7 h-7 rounded-full object-cover border'
                          />
                        )}
                        <span className='text-gray-700 font-medium'>
                          {cliente.nome}
                        </span>
                        <span className='text-gray-500 text-xs ml-1'>
                          {currencyFormatter(cliente.valor_total)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='mt-3 flex items-center justify-between'>
                  <span className='text-gray-500 font-medium'>
                    Mesa: {comanda.numMesa}
                  </span>
                  <span className='text-xl font-bold text-primary'>
                    Total: {currencyFormatter(comanda.conta?.valTotal)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </MaxWidthWrapper>
    </Layout>
  );
};

export default withAuthCustomer(OrdersPage);

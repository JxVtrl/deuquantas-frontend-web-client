import React, { useState, useEffect } from 'react';
import { ComandaService, ComandaResponse } from '@/services/comanda.service';
import { CustomerLayout } from '@/layout';

const TestComandasPage: React.FC = () => {
  const [comandas, setComandas] = useState<ComandaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComandas = async () => {
      try {
        setLoading(true);
        const data = await ComandaService.getAllTestComandas();
        setComandas(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar comandas de teste:', err);
        setError(
          'Erro ao carregar comandas de teste. Tente novamente mais tarde.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComandas();
  }, []);

  return (
    <CustomerLayout>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold mb-6'>Comandas de Teste</h1>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            {error}
          </div>
        )}

        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFCC00]'></div>
          </div>
        ) : comandas.length === 0 ? (
          <div className='bg-gray-100 p-6 rounded-lg text-center'>
            <p className='text-gray-600'>
              Nenhuma comanda de teste encontrada.
            </p>
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-200 rounded-lg'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='py-3 px-4 text-left'>CPF</th>
                  <th className='py-3 px-4 text-left'>CNPJ</th>
                  <th className='py-3 px-4 text-left'>Mesa</th>
                  <th className='py-3 px-4 text-left'>Data</th>
                  <th className='py-3 px-4 text-left'>Item</th>
                  <th className='py-3 px-4 text-left'>Quantidade</th>
                  <th className='py-3 px-4 text-left'>Preço</th>
                </tr>
              </thead>
              <tbody>
                {comandas.map((comanda, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className='py-3 px-4 border-b'>{comanda.numCpf}</td>
                    <td className='py-3 px-4 border-b'>{comanda.numCnpj}</td>
                    <td className='py-3 px-4 border-b'>{comanda.numMesa}</td>
                    <td className='py-3 px-4 border-b'>
                      {new Date(comanda.datApropriacao).toLocaleString()}
                    </td>
                    <td className='py-3 px-4 border-b'>{comanda.codItem}</td>
                    <td className='py-3 px-4 border-b'>{comanda.numQuant}</td>
                    <td className='py-3 px-4 border-b'>
                      {typeof comanda.valPreco === 'number'
                        ? comanda.valPreco.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })
                        : comanda.valPreco}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
};

export default TestComandasPage;

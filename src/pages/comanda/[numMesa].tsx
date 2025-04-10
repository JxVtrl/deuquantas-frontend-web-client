import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ComandaService } from '@/services/comanda.service';
import { CustomerLayout } from '@/layout';
import { withAuthCustomer } from '@/hoc/withAuth';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

interface ComandaData {
  num_cpf: string;
  num_cnpj: string;
  numMesa: string;
  datApropriacao: string;
  horPedido: string;
  codItem: string;
  numQuant: number;
  valPreco: number;
}

const ComandaMesa: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { numMesa } = router.query;
  const [comanda, setComanda] = useState<ComandaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const buscarComandaAtiva = async () => {
      try {
        if (!numMesa || !user?.cliente?.num_cpf) {
          return;
        }

        setLoading(true);
        setError(null);

        const token = Cookies.get('token') || '';
        const comandaAtiva = await ComandaService.getComandaAtivaByCliente(
          user.cliente.num_cpf,
          token,
        );

        if (!comandaAtiva) {
          setError('Nenhuma comanda ativa encontrada.');
          return;
        }

        if (comandaAtiva.numMesa !== numMesa) {
          toast.error('Mesa não corresponde à comanda ativa');
          router.replace('/home');
          return;
        }

        setComanda(comandaAtiva);
      } catch (err) {
        console.error('Erro ao buscar comanda:', err);
        setError('Erro ao buscar comanda. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    buscarComandaAtiva();
  }, [user, numMesa, router]);

  if (loading) {
    return (
      <CustomerLayout>
        <div className='flex justify-center items-center h-screen'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFCC00]'></div>
        </div>
      </CustomerLayout>
    );
  }

  if (error) {
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

  if (!comanda) {
    return (
      <CustomerLayout>
        <div className='flex justify-center items-center h-screen'>
          <div className='bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded'>
            Nenhuma comanda ativa encontrada.
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold mb-6'>Minha Comanda</h1>

        <div className='bg-white rounded-lg shadow-md p-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <p className='text-gray-600'>Mesa:</p>
              <p className='font-semibold'>{comanda.numMesa}</p>
            </div>
            <div>
              <p className='text-gray-600'>Data:</p>
              <p className='font-semibold'>
                {new Date(comanda.datApropriacao).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className='text-gray-600'>Hora do Pedido:</p>
              <p className='font-semibold'>
                {comanda.horPedido
                  ? new Date(comanda.horPedido).toLocaleTimeString()
                  : 'Aguardando pedido'}
              </p>
            </div>
          </div>

          <div className='mt-6'>
            <h2 className='text-xl font-semibold mb-4'>Itens</h2>
            <div className='border rounded-lg p-4'>
              <p className='text-gray-600'>Código do Item:</p>
              <p className='font-semibold'>{comanda.codItem}</p>
              <p className='text-gray-600 mt-2'>Quantidade:</p>
              <p className='font-semibold'>{comanda.numQuant}</p>
              <p className='text-gray-600 mt-2'>Preço:</p>
              <p className='font-semibold'>R$ {comanda.valPreco.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default withAuthCustomer(ComandaMesa);

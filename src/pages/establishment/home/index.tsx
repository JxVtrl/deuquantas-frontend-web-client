import { withAuthEstablishment } from '@/hoc/withAuth';
import EstablishmentLayout from '@/layout/EstablishmentLayout';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/axios';
import { Mesa } from '@/services/api/types';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMesas = async () => {
      if (!user?.estabelecimento?.num_cnpj) return;

      try {
        const response = await api.get(
          `/estabelecimentos/${user.estabelecimento.num_cnpj}/mesas`,
        );
        setMesas(response.data);
      } catch (error) {
        console.error('Erro ao buscar mesas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMesas();
  }, [user?.estabelecimento?.num_cnpj]);

  console.log('mesas', mesas);

  return (
    <EstablishmentLayout>
      <div className='p-6'>
        <h1 className='text-2xl font-bold mb-6'>Gerenciamento de Mesas</h1>

        {loading ? (
          <div>Carregando...</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {mesas.length > 0 ? (
              mesas.map((mesa) => (
                <div
                  key={`${mesa.num_cnpj}-${mesa.numMesa}`}
                  className='bg-white p-4 rounded-lg shadow'
                >
                  <h3 className='font-semibold'>Mesa {mesa.numMesa}</h3>
                  <p>Capacidade: {mesa.numMaxPax} pessoas</p>
                  <p>Status: {mesa.is_ativo ? 'Ativa' : 'Inativa'}</p>
                </div>
              ))
            ) : (
              <div>Nenhuma mesa encontrada</div>
            )}
          </div>
        )}
      </div>
    </EstablishmentLayout>
  );
};

export default withAuthEstablishment(Home);

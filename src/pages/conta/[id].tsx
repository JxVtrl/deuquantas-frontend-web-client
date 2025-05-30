import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/layout';
import { withAuthCustomer } from '@/hoc/withAuth';
import { useComanda } from '@/contexts/ComandaContext';
import { NavigationPills } from '@/components/NavigationPills';
import {
  ComandaButtons,
  ComandaValueChart,
  ComandaNotifications,
  ComandaPayButton,
} from '@/components/Comanda';
import { contaNavigationPills } from '@/data/home_navigation_pills';
import SeoHead from '@/components/SeoHead';
const ContaPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { comanda, loading, error, fetchComandasAtivas, fetchComanda } =
    useComanda();

  useEffect(() => {
    fetchComandasAtivas();
  }, []);

  useEffect(() => {
    if (id) {
      fetchComanda(id as string);
    }
  }, [id, fetchComanda]);

  if (loading) {
    return (
      <>
        <SeoHead title='Carregando comanda - DeuQuantas' />
        <Layout>
          <div className='flex justify-center items-center h-screen'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFCC00]'></div>
          </div>
        </Layout>
      </>
    );
  }

  if (error || !comanda) {
    return (
      <>
        <SeoHead title='Erro ao carregar comanda - DeuQuantas' />
        <Layout>
          <div className='flex justify-center items-center h-screen'>
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
              {error}
            </div>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <SeoHead title='Comanda - DeuQuantas' />
      <Layout>
        <NavigationPills navigationPills={contaNavigationPills} />
        <ComandaButtons />
        <ComandaValueChart />
        <ComandaNotifications />
        <ComandaPayButton />
      </Layout>
    </>
  );
};

export default withAuthCustomer(ContaPage);

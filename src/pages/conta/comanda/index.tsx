import React, { useEffect } from 'react';
import Layout from '@/layout';
import { withAuthCustomer } from '@/hoc/withAuth';
import { useComanda } from '@/contexts/ComandaContext';
import { NavigationPills } from '@/components/NavigationPills';
import { ComandaHeader } from '@/components/Comanda/Header';
import { ComandaList } from '@/components/Comanda/List';
import { ComandaPayOptions } from '@/components/Comanda/PayOptions';
import SeoHead from '@/components/SeoHead';
import { ItemActionsDrawer } from '@/components/Comanda/Item/Drawer';

const ComandaPage = () => {
  const { comanda, loading, error, setSelectedItem } = useComanda();

  useEffect(() => {
    setSelectedItem(null);
  }, []);

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
        <NavigationPills hasArrowBack navigationPills={[]} />
        <ComandaHeader />
        <ComandaList />
        <ComandaPayOptions />
        <ItemActionsDrawer />
      </Layout>
    </>
  );
};

export default withAuthCustomer(ComandaPage);

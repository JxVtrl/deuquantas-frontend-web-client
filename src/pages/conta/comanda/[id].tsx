import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/layout';
import { withAuthCustomer } from '@/hoc/withAuth';
import { useComanda } from '@/contexts/ComandaContext';
import { NavigationPills } from '@/components/NavigationPills';
import ComandaButtons from '@/components/ComandaButtons';
import { ComandaValueChart } from '@/components/ComandaValueChart';
import ComandaNotifications from '@/components/ComandaNotifications';
import { Button, MaxWidthWrapper } from '@deuquantas/components';

const ComandaPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { comanda, loading, error, fetchComanda } = useComanda();

  useEffect(() => {
    if (!id) return;
    fetchComanda(id as string);
  }, [id, fetchComanda]);

  if (loading) {
    return (
      <Layout>
        <div className='flex justify-center items-center h-screen'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFCC00]'></div>
        </div>
      </Layout>
    );
  }

  if (error || !comanda) {
    return (
      <Layout>
        <div className='flex justify-center items-center h-screen'>
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <NavigationPills />
      <ComandaButtons />
      <ComandaValueChart />
      <ComandaNotifications />
      <MaxWidthWrapper>
        <Button
          variant='primary'
          text='PAGAMENTO'
          style={{
            width: '100%',
            marginTop: '24px',
          }}
        />
      </MaxWidthWrapper>
    </Layout>
  );
};

export default withAuthCustomer(ComandaPage);

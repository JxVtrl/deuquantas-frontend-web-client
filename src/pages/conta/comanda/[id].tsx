import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { CustomerLayout } from '@/layout';
import { withAuthCustomer } from '@/hoc/withAuth';
import { useComanda } from '@/contexts/ComandaContext';
import { NavigationPills } from '@/components/NavigationPills';
import ComandaButtons from '@/components/ComandaButtons';
import { ComandaValueChart } from '@/components/ComandaValueChart';

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
      <NavigationPills />
      <ComandaButtons />
      <ComandaValueChart />
    </CustomerLayout>
  );
};

export default withAuthCustomer(ComandaPage);

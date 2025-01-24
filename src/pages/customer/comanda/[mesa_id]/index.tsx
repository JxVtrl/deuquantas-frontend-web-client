import { useRouter } from 'next/router';
import { CustomerLayout } from '@/layout';
import HeadTitle from '@/components/HeadTitle';
import HomeTab from '@/components/Home/HomeTab';
import { useCustomerContext } from '@/contexts/CustomerContext';
import { useEffect } from 'react';

const ComandaPage = () => {
  const { setActiveHomeTab } = useCustomerContext();
  const router = useRouter();
  const { mesa_id, clienteId } = router.query;

  useEffect(() => {
    setActiveHomeTab('comanda');
  }, []);

  if (!mesa_id || !clienteId) {
    return (
      <CustomerLayout>
        <div className='flex items-center justify-center h-full'>
          <p className='text-gray-600 text-lg'>Carregando...</p>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <HeadTitle />
      <HomeTab />
    </CustomerLayout>
  );
};

export default ComandaPage;

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CustomerLayout } from '@/layout';
import HeadTitle from '@/components/HeadTitle';
import HomeTab from '@/components/Home/HomeTab';

const ComandaPage = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { mesa_id, clienteId } = router.query;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!mesa_id || !clienteId) {
      router.push('/customer/home');
    }
  }, [mesa_id, clienteId, router]);

  if (!isClient) return null; // Garante que não roda no servidor

  return (
    <CustomerLayout>
      <HeadTitle />
      <HomeTab />
    </CustomerLayout>
  );
};

export default ComandaPage;

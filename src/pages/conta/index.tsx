import { useComanda } from '@/contexts/ComandaContext';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withAuthCustomer } from '@/hoc/withAuth';
import SeoHead from '@/components/SeoHead';
const Conta: React.FC = () => {
  const { fetchComandasAtivas, comandasAtivas } = useComanda();
  const router = useRouter();

  useEffect(() => {
    const checkComandaAtiva = async () => {
      await fetchComandasAtivas();
      if (comandasAtivas.length > 0) {
        router.push(`/conta/${comandasAtivas[0].id}`);
      } else {
        router.push('/qr-code');
      }
    };

    checkComandaAtiva();
  }, [fetchComandasAtivas, router]);

  return (
    <>
      <SeoHead title='Carregando comanda - DeuQuantas' />
    </>
  );
};

export default withAuthCustomer(Conta);

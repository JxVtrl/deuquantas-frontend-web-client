import { useComanda } from '@/contexts/ComandaContext';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withAuthCustomer } from '@/hoc/withAuth';

const Comanda: React.FC = () => {
  const { fetchComandaAtivaId } = useComanda();
  const router = useRouter();

  useEffect(() => {
    const checkComandaAtiva = async () => {
      const comandaId = await fetchComandaAtivaId();
      if (comandaId) {
        router.push(`/conta/comanda/${comandaId}`);
      } else {
        router.push('/qr-code');
      }
    };

    checkComandaAtiva();
  }, [fetchComandaAtivaId, router]);

  return <></>;
};

export default withAuthCustomer(Comanda);

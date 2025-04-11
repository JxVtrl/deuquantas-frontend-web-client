import { useComanda } from '@/contexts/ComandaContext';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const Comanda: React.FC = () => {
  const { fetchComandaAtiva } = useComanda();
  const router = useRouter();

  useEffect(() => {
    const checkComandaAtiva = async () => {
      const comandaId = await fetchComandaAtiva();
      if (comandaId) {
        router.push(`/conta/comanda/${comandaId}`);
      } else {
        router.push('/qr-code');
      }
    };

    checkComandaAtiva();
  }, [fetchComandaAtiva, router]);

  return <></>;
};

export default Comanda;

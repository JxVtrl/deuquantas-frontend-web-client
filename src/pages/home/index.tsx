import { withAuthCustomer } from '@/hoc/withAuth';
import React, { useEffect } from 'react';
import { NavigationPills } from '@/components/NavigationPills';
import { ActionGrid } from '@/components/ActionGrid';
import { FavoritePlaces } from '@/components/FavoritePlaces';
import { CustomerLayout } from '@/layout';
import { PromotionSlider } from '@/components/PromotionSlider';
import { useComanda } from '@/contexts/ComandaContext';
import { useRouter } from 'next/router';

const CustomerHome: React.FC = () => {
  const { fetchComandaAtiva } = useComanda();
  const router = useRouter();

  useEffect(() => {
    const checkComandaAtiva = async () => {
      const comandaId = await fetchComandaAtiva();
      if (comandaId) {
        router.push(`/comanda/${comandaId}`);
      }
    };

    checkComandaAtiva();
  }, [fetchComandaAtiva, router]);

  return (
    <CustomerLayout>
      <NavigationPills />
      <ActionGrid />
      <FavoritePlaces />
      <PromotionSlider />
    </CustomerLayout>
  );
};

export default withAuthCustomer(CustomerHome);

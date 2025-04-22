import { withAuthCustomer } from '@/hoc/withAuth';
import React, { useEffect, useState } from 'react';
import { NavigationPills } from '@/components/NavigationPills';
import Layout from '@/layout';
import { PromotionSlider } from '@/components/PromotionSlider';
import { useNavigation } from '@/hooks/useNavigation';
import { useComanda } from '@/contexts/ComandaContext';
import { ActionSquared, ReceiptIcon } from '@deuquantas/components';
import { FavoritePlaces } from '@/sections/FavoritePlaces';
import { useRouter } from 'next/router';
const CustomerHome: React.FC = () => {
  const { actionItems } = useNavigation();
  const router = useRouter();

  const { fetchComandaAtiva, comanda } = useComanda();

  const checkComandaAtiva = async () => {
    await fetchComandaAtiva();
  };

  useEffect(() => {
    checkComandaAtiva();
  }, []);

  const actionsResolved = actionItems.map((item) => {
    if (item.href === '/qr-code' && comanda) {
      return {
        onClick: () => router.push('/conta/comanda'),
        label: 'Comanda',
        icon: ReceiptIcon,
      };
    }
    return item;
  });

  return (
    <Layout>
      <NavigationPills />
      <ActionSquared
        actionItems={
          actionsResolved as unknown as {
            icon: React.FC;
            label: string;
            onClick: () => void;
          }[]
        }
      />
      <FavoritePlaces />
      <PromotionSlider />
    </Layout>
  );
};

export default withAuthCustomer(CustomerHome);

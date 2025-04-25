import { withAuthCustomer } from '@/hoc/withAuth';
import React, { useEffect } from 'react';
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
        onClick: () => {
          router.push('/conta/comanda');
        },
        label: 'Comanda',
        icon: ReceiptIcon as () => React.JSX.Element,
      };
    }
    return {
      onClick: () => {
        router.push(item.href);
      },
      label: item.label,
      icon: item.icon as () => React.JSX.Element,
    };
  });

  return (
    <Layout>
      <NavigationPills />
      <ActionSquared actionItems={actionsResolved} />
      <FavoritePlaces />
      <PromotionSlider />
    </Layout>
  );
};

export default withAuthCustomer(CustomerHome);

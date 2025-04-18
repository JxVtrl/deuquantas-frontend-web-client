import { withAuthCustomer } from '@/hoc/withAuth';
import React, { useEffect, useState } from 'react';
import { NavigationPills } from '@/components/NavigationPills';
import { CustomerLayout } from '@/layout';
import { PromotionSlider } from '@/components/PromotionSlider';
import { useNavigation } from '@/hooks/useNavigation';
import { useComanda } from '@/contexts/ComandaContext';
import { ActionItem } from '@/data/actions';
import { ActionGrid, ReceiptIcon } from '@deuquantas/components';
import { MaxWidthWrapper } from '@deuquantas/components';
import { FavoritePlaces } from '@/sections/FavoritePlaces';

const CustomerHome: React.FC = () => {
  const { actionItems } = useNavigation();

  const [comanda, setComanda] = useState<boolean>(false);
  const { fetchComandaAtiva } = useComanda();

  useEffect(() => {
    const checkComandaAtiva = async () => {
      const comandaId = await fetchComandaAtiva();
      setComanda(!!comandaId);
    };

    checkComandaAtiva();
  }, [fetchComandaAtiva]);

  const actionItemsWithComanda: ActionItem[] = actionItems.map((item) => {
    if (item.href === '/qr-code') {
      return {
        href: '/conta/comanda',
        label: 'Comanda',
        icon: ReceiptIcon,
      };
    }
    return item;
  });

  return (
    <CustomerLayout>
      <NavigationPills />
      <MaxWidthWrapper>
        <ActionGrid actionItems={actionItemsWithComanda} />
      </MaxWidthWrapper>
      <FavoritePlaces />
      <PromotionSlider />
    </CustomerLayout>
  );
};

export default withAuthCustomer(CustomerHome);

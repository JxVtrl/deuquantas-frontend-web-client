import { withAuthCustomer } from '@/hoc/withAuth';
import React from 'react';
import { NavigationPills } from '@/components/NavigationPills';
import { ActionGrid } from '@/components/ActionGrid';
import { FavoritePlaces } from '@/components/FavoritePlaces';
import { CustomerLayout } from '@/layout';

const CustomerHome: React.FC = () => {
  return (
    <CustomerLayout>
      <NavigationPills />
      <ActionGrid />
      <FavoritePlaces />
    </CustomerLayout>
  );
};

export default withAuthCustomer(CustomerHome);

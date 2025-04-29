import React from 'react';
import Layout from '@/layout';
import { withAuthCustomer } from '@/hoc/withAuth';
import { NavigationPills } from '@/components/NavigationPills';
import { PromotionSlider } from '@/sections/Promotions';
import { FavoritePlaces } from '@/sections/FavoritePlaces';
import { ActionsHome } from '@/sections/ActionsHome';
import { OpenComandas } from '@/sections/OpenComandas';
import { customerNavigationPills } from '@/data/home_navigation_pills';

const CustomerHome: React.FC = () => {
  return (
    <Layout>
      <NavigationPills navigationPills={customerNavigationPills} />
      <ActionsHome />
      <OpenComandas />
      <FavoritePlaces />
      <PromotionSlider />
    </Layout>
  );
};

export default withAuthCustomer(CustomerHome);

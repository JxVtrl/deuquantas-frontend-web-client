import { withAuthEstablishment } from '@/hoc/withAuth';
import EstablishmentLayout from '@/layout/EstablishmentLayout';
import React from 'react';

const Home: React.FC = () => {
  return (
    <EstablishmentLayout>
      <div />
    </EstablishmentLayout>
  );
};

export default withAuthEstablishment(Home);

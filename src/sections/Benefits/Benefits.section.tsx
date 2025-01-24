import HomeCard from '@/components/Home/HomeCard';
import SectionTitle from '@/components/SectionTitle';
import React from 'react';

export const Benefits: React.FC = () => {
  return (
    <div
      style={{
        marginTop: '24px',
      }}
    >
      <SectionTitle title='Saiba mais' />
      <HomeCard />
    </div>
  );
};

// import HomeCard from '@/components/Home/HomeCard';
import SectionTitle from '@/components/SectionTitle';
import React from 'react';
import styles from './Benefits.module.scss';

export const Benefits: React.FC = () => {
  return (
    <div className={styles.container}>
      <SectionTitle title='Saiba mais' />
      {/* <HomeCard /> */}
    </div>
  );
};

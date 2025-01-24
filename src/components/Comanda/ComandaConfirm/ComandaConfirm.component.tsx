import SectionTitle from '@/components/SectionTitle';
import React from 'react';
import styles from './ComandaConfirm.module.scss';
import { ConfirmCard } from './components';
import { confirm_order } from '@/data/confirm_cards.data';

export const ComandaConfirm: React.FC = () => {
  return (
    <div className={styles.container}>
      <SectionTitle title='Confirmar pedidos' />

      <div className={styles.confirmCardContainer}>
        {confirm_order.map((item, index) => (
          <ConfirmCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

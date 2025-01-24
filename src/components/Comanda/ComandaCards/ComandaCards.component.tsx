import React from 'react';
import { ComandaCard } from './components';
import { cards } from '@/data/comanda_cards.data';
import styles from './ComandaCards.module.scss';

export const ComandaCards: React.FC = () => {
  return (
    <div className={styles.comandaCards}>
      {cards.map((card, index) => (
        <ComandaCard key={index} {...card} />
      ))}
    </div>
  );
};

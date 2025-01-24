import React from 'react';
import styles from './Footer.module.scss';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>
        © {new Date().getFullYear()} DeuQuantas. Todos os direitos reservados.
      </p>
    </footer>
  );
};

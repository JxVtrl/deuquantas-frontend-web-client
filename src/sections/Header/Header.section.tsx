import React from 'react';
import Logo from '@/components/Logo';
import Avatar from '@/components/Avatar';
import styles from './Header.module.scss';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Avatar />
      <Logo />
    </header>
  );
};

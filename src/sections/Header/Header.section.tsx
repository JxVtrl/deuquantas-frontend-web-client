import React from 'react';
import Logo from '@/components/Logo';
import Avatar from '@/components/Avatar';
import styles from './Header.module.scss';
import { useRouter } from 'next/router';
export const Header: React.FC = () => {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <Avatar
        onClick={() => {
          router.push(`/customer/profile`);
        }}
      />
      <Logo />
    </header>
  );
};

import { Footer, Header } from '@/sections';
import Image from 'next/image';
import styles from './CustomerLayout.module.scss';

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Image
        src='/backgrounds/gradient.svg'
        alt='background'
        layout='fill'
        quality={100}
        className={styles.background_image}
      />
      <div className={styles.layout_container}>
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
}

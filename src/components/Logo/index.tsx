import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCustomerContext } from '@/contexts/CustomerContext';

const Logo: React.FC = () => {
  const { setActiveHomeTab } = useCustomerContext();
  return (
    <Link
      href='/customer/home'
      className='flex items-center justify-center'
      style={{ cursor: 'pointer', zIndex: 1 }}
      onClick={() => {
        setActiveHomeTab('qr-code');
      }}
    >
      <Image
        src='/brand/logo.svg'
        alt='Logo DeuQuantas'
        width={56}
        height={24}
        quality={100}
        priority
      />
    </Link>
  );
};

export default Logo;

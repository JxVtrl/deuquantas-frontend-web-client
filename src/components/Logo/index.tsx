import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  variant?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
};

const Logo: React.FC<LogoProps> = ({ variant = 'light', size = 'small' }) => {
  const width = size === 'small' ? 56 : size === 'medium' ? 100 : 202;
  const height = size === 'small' ? 24 : size === 'medium' ? 40 : 86;

  return (
    <Link
      href={'/home'}
      className='flex items-center justify-center  transition-all duration-300'
      style={{ cursor: 'pointer', zIndex: 1 }}
    >
      <Image
        src={variant === 'light' ? '/brand/logo.svg' : '/brand/logo-dark.svg'}
        alt='Logo DeuQuantas'
        width={width}
        height={height}
        quality={100}
        priority
      />
    </Link>
  );
};

export default Logo;

import Image from 'next/image';
import React from 'react';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'menu';
  onClick?: (e: React.FormEvent<Element>) => void | (() => void);
  disabled?: boolean;
  text: string | React.ReactNode;
  icon?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  onClick,
  disabled,
  text,
  icon,
  type = 'button',
  className,
}) => {
  const sharedClasses =
    'p-[12px] h-[40px] rounded-md hover:bg-[#272727]/80 focus:outline-none focus:ring-2 focus:ring-[#272727]';

  const buttonClasses = {
    primary: `${sharedClasses} bg-[#272727] text-[#EBEDF0] border border-[#272727] hover:bg-[#272727]/80 focus:ring-[#272727]`,
    secondary: `${sharedClasses} bg-[#F0F0F0] text-[#272727] border border-solid border-[#808080]/80 hover:bg-[#F0F0F0]/80 focus:ring-[#808080]/80`,
    menu: `${sharedClasses} bg-[#F0F0F0] text-[#000000] border border-[#272727] focus:ring-[#272727] hover:scale-105 transition-all duration-300 hover:bg-[#F0F0F0] `,
  };

  const handleClick = (e: React.FormEvent<Element>) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`${buttonClasses[variant]} ${className}`}
      onClick={handleClick}
      disabled={disabled}
      type={type}
    >
      {icon && (
        <Image
          src={icon.src}
          alt={icon.alt}
          width={icon.width}
          height={icon.height}
        />
      )}
      <p className='text-[14px] leading-[120%] font-[500]'>{text}</p>
    </button>
  );
};

export default Button;

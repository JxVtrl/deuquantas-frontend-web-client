import Image from 'next/image';
import React from 'react';

interface ButtonProps {
  variant:
    | 'primary'
    | 'secondary'
    | 'notification_primary'
    | 'notification_secondary'
    | 'menu';
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
    'p-[12px] h-[40px] rounded-md hover:bg-[#272727]/80 focus:outline-none focus:ring-2 focus:ring-[#272727] transition-all duration-300 shrink-0 flex items-center justify-center';

  const buttonClasses = {
    primary: `
    ${sharedClasses} 
    bg-[#272727] 
    text-[#EBEDF0] 
    border 
    border-[#272727] 
    hover:bg-[#272727]/80 
    focus:ring-[#272727]
    `,
    secondary: `
    ${sharedClasses} 
    bg-[#F0F0F0] 
    text-[#272727] 
    border 
    border-solid 
    border-[#808080]/80 
    hover:bg-[#F0F0F0]/80 
    focus:ring-[#808080]/80
    `,
    notification_primary: `
    ${sharedClasses}
    w-[40px]
    h-[40px]
    rounded-[36px] 
    bg-[#FFCC00] 
    text-[#1D1B20] 
    border 
    border-solid 
    border-[#FFCC00]/80 
    hover:border-[#E5E5EA]/80 
    hover:bg-[#E5E5EA] 
    focus:ring-[#E5E5EA]
    `,
    notification_secondary: `
    ${sharedClasses} 
    w-[40px]
    h-[40px]
    rounded-[36px]
    bg-[#E5E5EA] 
    text-[#272727] 
    border 
    border-solid 
    border-[#E5E5EA]/80 
    hover:bg-[#F0F0F0]/80 
    focus:ring-[#808080]/80
    `,
    menu: `
    ${sharedClasses} 
    bg-[#F0F0F0] 
    text-[#000000] 
    border 
    border-[#272727] 
    focus:ring-[#272727] 
    hover:scale-105 
    
    hover:bg-[#F0F0F0] 
    `,
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

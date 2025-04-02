import React from 'react';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick?: (e: React.FormEvent<Element>) => void | (() => void);
  disabled?: boolean;
  text: string;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  onClick,
  disabled,
  text,
}) => {
  const sharedClasses =
    'p-[12px] h-[40px] rounded-md hover:bg-[#272727]/80 focus:outline-none focus:ring-2 focus:ring-[#272727]';

  const buttonClasses = {
    primary: `${sharedClasses} bg-[#272727] text-[#EBEDF0] border border-[#272727] hover:bg-[#272727]/80 focus:ring-[#272727]`,
    secondary: `${sharedClasses} bg-[#F0F0F0] text-[#272727] border border-solid border-[#808080]/80 hover:bg-[#F0F0F0]/80 focus:ring-[#808080]/80`,
  };

  const handleClick = (e: React.FormEvent<Element>) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`${buttonClasses[variant]}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <p className='text-[14px] leading-[120%] font-[500]'>{text}</p>
    </button>
  );
};

export default Button;

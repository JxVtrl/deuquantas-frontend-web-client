import { useNavigation } from '@/hooks/useNavigation';
import { MaxWidthWrapper } from '@deuquantas/components';
import { useRouter } from 'next/router';
import React from 'react';

interface NavigationPill {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  hasArrowBack?: boolean;
}

const Pill: React.FC<NavigationPill> = ({
  label,
  isActive,
  onClick,
  hasArrowBack,
}) => (
  <button
    onClick={onClick}
    style={{
      borderColor: hasArrowBack
        ? '#00000040'
        : isActive
          ? '#FFCC00'
          : '#000000',
      backgroundColor: hasArrowBack
        ? 'transparent'
        : isActive
          ? '#FFCC00'
          : '#ffffff',
      fontWeight: hasArrowBack ? 500 : isActive ? 'bold' : 'normal',
      borderRadius: hasArrowBack ? '6px' : '32px',
    }}
    className={`h-[24px] px-${hasArrowBack ? '[16px]' : 4} flex items-center justify-center
    whitespace-nowrap border border-solid hover:bg-[#FFCC00] hover:border-[#FFCC00] hover:font-bold
     transition-all duration-300`}
  >
    <p className={`text-[14px] leading-[140%] text-center`}>{label}</p>
  </button>
);

export const NavigationPills: React.FC<{
  hasArrowBack?: boolean;
}> = ({ hasArrowBack = false }) => {
  const { navigationPills } = useNavigation();
  const router = useRouter();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {hasArrowBack && (
        <div
          onClick={() => {
            router.back();
          }}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderBottom: '1px solid #F0F0F0',
            paddingBottom: 12,
            paddingTop: 6,
            marginTop: 20,
            marginLeft: 16,
          }}
        >
          <svg
            width='17'
            height='16'
            viewBox='0 0 17 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M4.325 9L9.925 14.6L8.5 16L0.5 8L8.5 0L9.925 1.4L4.325 7H16.5V9H4.325Z'
              fill='#1D1B20'
            />
          </svg>
          <p className='text-[14px] leading-[140%] font-bold text-center'>
            Painel
          </p>
        </div>
      )}
      <div
        style={{
          gap: hasArrowBack ? 6 : 16,
          borderBottom: hasArrowBack ? 'none' : '1px solid #F0F0F0',
        }}
        className='my-[20px] px-[16px] flex overflow-x-auto'
      >
        {navigationPills.map((pill) => (
          <Pill key={pill.label} {...pill} hasArrowBack={hasArrowBack} />
        ))}
      </div>
    </div>
  );
};

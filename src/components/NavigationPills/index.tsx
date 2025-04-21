import { useNavigation } from '@/hooks/useNavigation';
import { MaxWidthWrapper } from '@deuquantas/components';
import { useRouter } from 'next/router';
import React from 'react';

interface NavigationPill {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const Pill: React.FC<NavigationPill> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`h-[24px] px-4 flex items-center justify-center rounded-full text-sm whitespace-nowrap border border-solid hover:bg-[#FFCC00] hover:border-[#FFCC00] hover:font-bold transition-all duration-300 ${isActive
      ? 'bg-[#FFCC00] border-[#FFCC00] font-bold'
      : 'bg-[#ffffff] border-[#000000] '
      }`}
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
    <MaxWidthWrapper styleContent={{
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }}>
      {hasArrowBack && (
        <div onClick={() => {
          router.back()
        }} style={{
          cursor: 'pointer'
        }}>
          <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.325 9L9.925 14.6L8.5 16L0.5 8L8.5 0L9.925 1.4L4.325 7H16.5V9H4.325Z" fill="#1D1B20" />
          </svg>
        </div>
      )}
      <div className='py-[16px] flex gap-2 overflow-x-auto border-b border-[#F0F0F0]'>
        {navigationPills.map((pill) => (
          <Pill key={pill.label} {...pill} />
        ))}
      </div>
    </MaxWidthWrapper>
  );
};

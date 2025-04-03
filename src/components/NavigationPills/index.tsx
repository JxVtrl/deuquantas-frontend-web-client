import { useNavigation } from '@/hooks/useNavigation';
import { MaxWidthLayout } from '@/layout';
import React from 'react';

interface NavigationPill {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const Pill: React.FC<NavigationPill> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border border-solid hover:bg-[#FFCC00] hover:border-[#FFCC00] hover:font-bold transition-all duration-300 ${
      isActive
        ? 'bg-[#FFCC00] border-[#FFCC00] font-bold'
        : 'bg-[#ffffff] border-[#000000] '
    }`}
  >
    <p className={`text-[14px] leading-[140%] text-center`}>{label}</p>
  </button>
);

export const NavigationPills: React.FC = () => {
  const { navigationPills } = useNavigation();

  return (
    <MaxWidthLayout>
      <div className='py-[16px] flex gap-2 overflow-x-auto border-b border-[#F0F0F0]'>
        {navigationPills.map((pill) => (
          <Pill key={pill.label} {...pill} />
        ))}
      </div>
    </MaxWidthLayout>
  );
};

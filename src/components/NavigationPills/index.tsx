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
    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
      isActive ? 'bg-[#F5B800]' : 'bg-white'
    }`}
  >
    {label}
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

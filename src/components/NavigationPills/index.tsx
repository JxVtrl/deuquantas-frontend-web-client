import React from 'react';

interface NavigationPill {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface NavigationPillsProps {
  pills: NavigationPill[];
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

export const NavigationPills: React.FC<NavigationPillsProps> = ({ pills }) => {
  return (
    <div className='px-4 py-2 flex gap-2 overflow-x-auto'>
      {pills.map((pill) => (
        <Pill key={pill.label} {...pill} />
      ))}
    </div>
  );
};

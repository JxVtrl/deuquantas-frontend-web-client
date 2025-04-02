import React from 'react';
import Link from 'next/link';
import MaxWidthLayout from '@/layout/MaxWidthLayout';

export interface ActionItem {
  icon: React.FC;
  label: string;
  href: string;
}

interface ActionGridProps {
  items: ActionItem[];
}

const ActionGridItem: React.FC<ActionItem & { isScanQR?: boolean }> = ({
  icon: Icon,
  label,
  href,
  isScanQR,
}) => {
  return (
    <Link href={href} className='flex flex-col text-black items-center'>
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 ${
          isScanQR
            ? 'bg-[#FFCC00] shadow-lg transform hover:scale-105 transition-transform duration-200 border-2 border-black'
            : 'bg-gray-100'
        }`}
      >
        <Icon />
      </div>
      <div className={`text-xs text-center ${isScanQR ? 'font-bold' : ''}`}>
        {label}
      </div>
    </Link>
  );
};

export const ActionGrid: React.FC<ActionGridProps> = ({ items }) => {
  return (
    <MaxWidthLayout>
      <div className='grid grid-cols-5 gap-4 px-4 py-6'>
        {items.map((item, index) => (
          <ActionGridItem
            key={item.href}
            {...item}
            isScanQR={index === 0} // First item is Scan QR
          />
        ))}
      </div>
    </MaxWidthLayout>
  );
};

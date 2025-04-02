import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PlusIcon } from '@/components/Icons';

export interface NavigationItem {
  icon: React.FC;
  label: string;
  href: string;
}

interface BottomNavigationProps {
  items: NavigationItem[];
  onAddClick?: () => void;
}

const NavigationItem: React.FC<NavigationItem & { isActive: boolean }> = ({
  icon: Icon,
  label,
  href,
  isActive,
}) => {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center ${
        isActive ? 'text-[#FFCC00]' : 'text-white'
      }`}
    >
      <Icon />
      <div className='text-xs'>{label}</div>
    </Link>
  );
};

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  onAddClick,
}) => {
  const router = useRouter();

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-black'>
      <div className='flex justify-around py-4'>
        {items.map((item) => (
          <NavigationItem
            key={item.href}
            {...item}
            isActive={router.pathname === item.href}
          />
        ))}
        <button
          onClick={onAddClick}
          className='w-14 h-14 bg-[#FFCC00] rounded-full border-4 border-white outline outline-2 outline-black flex items-center justify-center -mt-10'
        >
          <div className='text-black w-6 h-6'>
            <PlusIcon />
          </div>
        </button>
      </div>
    </div>
  );
};

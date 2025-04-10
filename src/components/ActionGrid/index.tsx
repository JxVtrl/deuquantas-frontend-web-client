import React from 'react';
import Link from 'next/link';
import { MaxWidthLayout } from '@/layout';
import { useNavigation } from '@/hooks/useNavigation';

export interface ActionItem {
  icon: React.FC;
  label: string;
  href: string;
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
        className={`w-[64px] h-[64px] rounded-2xl flex flex-col items-center justify-center gap-[6px] bg-[#F0F0F0] shadow-lg transform hover:scale-105 transition-transform duration-200 `}
      >
        <Icon />
        <p
          className={`text-[11px] leading-[140%] text-center ${isScanQR ? 'font-bold' : ''}`}
        >
          {label}
        </p>
      </div>
    </Link>
  );
};

export const ActionGrid: React.FC = () => {
  const { actionItems } = useNavigation();

  return (
    <MaxWidthLayout>
      <div className='flex gap-[15px] overflow-x-auto py-[20px]'>
        {actionItems.map((item) => {
          const isScanQr = item.href === '/qr-code';
          return (
            <ActionGridItem key={item.href} {...item} isScanQR={isScanQr} />
          );
        })}
      </div>
    </MaxWidthLayout>
  );
};

import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React from 'react';

export const HistoryInput: React.FC<{
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
}> = ({ value, onChange }) => {
  return (
    <div
      className='
      flex
      items-center
      gap-[8px]
      px-[16px]
      bg-[#F1DFCE]
      rounded-[100px]
      h-[48px]
    '
    >
      <Image
        src='/icons/magnifying.svg'
        width={15}
        height={15}
        alt='Ícone de lupa'
      />

      <Input
        placeholder='Buscar'
        className='
        border-none
        bg-transparent
        shadow-none
        focus-visible:ring-0
        px-0
        '
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

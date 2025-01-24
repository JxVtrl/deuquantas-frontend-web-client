import { ComandaCardProps } from '@/interfaces/comanda';
import Image from 'next/image';
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRouter } from 'next/router';
export const ComandaCard: React.FC<ComandaCardProps> = ({
  href,
  icon,
  title,
}) => {
  const router = useRouter();
  return (
    <Card
      className='w-full h-[143px] flex flex-col justify-between cursor-pointer bg-[#E7CDBD80] backdrop-filter backdrop-blur-[20px] rounded-[16px] shadow-none border-none'
      onClick={() => {
        router.push(href);
      }}
    >
      <CardHeader>
        <Image width={32} height={32} src={icon.src} alt={icon.alt} />
      </CardHeader>
      <CardContent className='flex gap-[4.23vw] items-end justify-between'>
        <h3 className='text-[14px] leading-[20px] m-0'>{title}</h3>
        <Image
          width={24}
          height={24}
          src='/icons/arrow-right.svg'
          alt='Ícone de seta para a direita'
        />
      </CardContent>
    </Card>
  );
};

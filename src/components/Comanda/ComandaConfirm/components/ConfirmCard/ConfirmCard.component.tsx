import { ConfirmOrder } from '@/interfaces/confirm';
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
export const ConfirmCard: React.FC<ConfirmOrder> = ({ name, quantity }) => {
  return (
    <Card className='w-full h-[120px] flex flex-col justify-between cursor-pointer bg-[#F1DECB] backdrop-filter backdrop-blur-[4px] rounded-[16px] border-none shadow-none'>
      <CardHeader className='flex-row gap-[32px] items-center pb-0'>
        <Image
          width={24}
          height={24}
          src='/icons/bottles.svg'
          alt='Ícone de garrafa de bebida'
        />

        <h1 className='text-[14px] leading-[20px] m-0 font-[500]'>
          {quantity}x {name}
        </h1>
      </CardHeader>

      <CardContent className='flex gap-[16px] items-end justify-between'>
        <Button
          className='w-full h-[40px] bg-[#FFCC00] text-black backdrop-filter backdrop-blur-[20px] rounded-[16px] shadow-none
        
          hover:bg-[#E7CDBD80]
        
        '
        >
          Aprovar
        </Button>
        <Button
          className='w-full h-[40px] bg-[#E7CDBD80] text-black
            backdrop-filter backdrop-blur-[20px] rounded-[16px] shadow-none
            
            hover:bg-[#F1DECB]
            '
        >
          Recusar
        </Button>
      </CardContent>
    </Card>
  );
};

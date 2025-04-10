import React from 'react';
import { cards } from '@/data/comanda_cards.data';
import styles from './ComandaCards.module.scss';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useRouter } from 'next/router';
import Image from 'next/image';

export const ComandaCards: React.FC = () => {
  const router = useRouter();
  return (
    <div className={styles.comandaCards}>
      {cards.map((card, index) => (
        <Card
          className='w-full h-[143px] flex flex-col justify-between cursor-pointer bg-[#E7CDBD80] backdrop-filter backdrop-blur-[20px] rounded-[16px] shadow-none border-none'
          onClick={() => {
            router.push(card.href);
          }}
          key={index}
        >
          <CardHeader>
            <Image
              width={32}
              height={32}
              src={card.icon.src}
              alt={card.icon.alt}
            />
          </CardHeader>
          <CardContent className='flex gap-[4.23vw] items-end justify-between'>
            <h3 className='text-[14px] leading-[20px] m-0'>{card.title}</h3>
            <Image
              width={24}
              height={24}
              src='/icons/arrow-right.svg'
              alt='Ícone de seta para a direita'
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

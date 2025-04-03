import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card } from '../ui/card';
import { MaxWidthLayout } from '@/layout';
import Image from 'next/image';

export const PromotionSlider: React.FC = () => {
  return (
    <MaxWidthLayout className='mt-[20px]'>
      <Carousel
        opts={{
          align: 'start',
        }}
        className='w-full'
      >
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className='md:basis-1/2 lg:basis-1/3 aspect-[2.28676]'
            >
              {/*  */}
              <Card
                className='h-full w-full relative rounded-[16px] overflow-hidden'
                style={{
                  background:
                    'linear-gradient(360deg, #000000 -13.17%, rgba(0, 0, 0, 0) 51.88%)',
                }}
              >
                <Image
                  src='/benefits/card.svg'
                  alt='Promotion'
                  layout='fill'
                  objectFit='cover'
                  className='absolute top-0 left-0 w-full h-full z-[-1]'
                />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </MaxWidthLayout>
  );
};

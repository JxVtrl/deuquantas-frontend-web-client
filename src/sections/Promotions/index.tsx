import React from 'react';

import Image from 'next/image';
import { Carousel } from '@/components/Carousel';
import { SwiperSlide } from 'swiper/react';
import { MaxWidthWrapper } from '@deuquantas/components';

interface Promotion {
  image: string;
}

export const PromotionSlider: React.FC = () => {
  const [promotions, setPromotions] = React.useState<Promotion[]>([]);

  const promotionsFallback = [
    {
      image: '/benefits/card.svg',
    },
    {
      image: '/benefits/card.svg',
    },
  ];

  React.useEffect(() => {
    const fetchPromotions = async () => {
      try {
        // const response = await fetch('/api/promotions');
        // const data = await response.json();
        setPromotions(promotionsFallback);
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setPromotions(promotionsFallback);
      }
    };
    fetchPromotions();
  }, []);

  return (
    <MaxWidthWrapper
      styleContent={{
        padding: 0,
      }}
    >
      <Carousel
        style={{
          padding: '20px 0 81px',
        }}
        spaceBetween={10}
      >
        {promotions.map((promotion, index) => (
          <SwiperSlide
            key={index}
            style={{
              aspectRatio: '2.28676',
              height: '100%',
              width: '311px',
              position: 'relative',
            }}
          >
            <Image
              src={promotion.image}
              alt='Promotion'
              layout='fill'
              objectFit='cover'
              className='absolute top-0 left-0 w-full h-full z-[-1]'
            />
          </SwiperSlide>
        ))}
      </Carousel>
    </MaxWidthWrapper>
  );
};

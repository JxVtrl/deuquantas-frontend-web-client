import React from 'react';

import { Card } from '@/components/ui/card';
import { MaxWidthWrapper } from '@deuquantas/components';
import Image from 'next/image';
import { Carousel } from '@/components/Carousel';
import { SwiperSlide } from 'swiper/react';
export const PromotionSlider: React.FC = () => {
  const [promotions, setPromotions] = React.useState<any[]>([]);

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
    <Carousel
      style={{
        padding: '20px 0',
      }}
      slidesPerView={1.2}
      spaceBetween={10}
    >
      {promotions.map((promotion, index) => (
        <SwiperSlide
          key={index}
          style={{
            aspectRatio: '2.28676',
            height: '100%',
            maxHeight: '136px',
            width: '100%',
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
      ))
      }
    </Carousel >
  );
};

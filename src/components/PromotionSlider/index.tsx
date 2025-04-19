import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Card } from '../ui/card';
import { MaxWidthWrapper } from '@deuquantas/components';
import Image from 'next/image';
import Autoplay from "embla-carousel-autoplay"
export const PromotionSlider: React.FC = () => {

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

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
        const response = await fetch('/api/promotions');
        const data = await response.json();

        if (data.length === 0) {
          setPromotions(promotionsFallback);
        } else {
          setPromotions(data);
        }
      } catch (error) {
        console.error('Error fetching promotions:', error);
        setPromotions(promotionsFallback);
      }
    };
    fetchPromotions();
  }, []);



  return (
    <MaxWidthWrapper
      style={{
        marginTop: '20px',
      }}
    >
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: 'center',
          loop: true,
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {promotions.map((promotion, index) => (
            <CarouselItem
              key={index}
              className='md:basis-1/2 lg:basis-1/3 aspect-[2.28676] max-w-[311px] max-h-[136px]'
            >
              <Card
                className='h-full w-full relative rounded-[16px] overflow-hidden'
                style={{
                  background:
                    'linear-gradient(360deg, #000000 -13.17%, rgba(0, 0, 0, 0) 51.88%)',
                }}
              >
                <Image
                  src={promotion.image}
                  alt='Promotion'
                  layout='fill'
                  objectFit='cover'
                  className='absolute top-0 left-0 w-full h-full z-[-1]'
                />
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </MaxWidthWrapper>
  );
};

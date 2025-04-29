import { ActionSquared, MaxWidthWrapper } from '@deuquantas/components';
import { SwiperSlide } from 'swiper/react';
import React from 'react';
import { useRouter } from 'next/router';
import { useNavigation } from '@/hooks/useNavigation';
import { Carousel } from '@/components/Carousel';

export const ActionsHome = () => {
  const { actionItems } = useNavigation();
  const router = useRouter();
  return (
    <MaxWidthWrapper
      styleContent={{
        padding: 0,
      }}
    >
      <Carousel
        style={{
          padding: '20px 0',
        }}
        spaceBetween={15}
      >
        {actionItems.map((action) => (
          <SwiperSlide
            key={action.label}
            style={{
              width: 'fit-content',
            }}
          >
            <ActionSquared
              {...action}
              onClick={() => {
                router.push(action.href);
              }}
            />
          </SwiperSlide>
        ))}
      </Carousel>
    </MaxWidthWrapper>
  );
};

import React from 'react';
import { Swiper } from 'swiper/react';
import 'swiper/css';

interface CarouselProps {
  children: React.ReactNode;
  slidesPerView?: number | 'auto';
  spaceBetween?: number;
  loop?: boolean;
  slidesOffsetBefore?: number;
  slidesOffsetAfter?: number;
  style?: React.CSSProperties;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  slidesPerView = 'auto',
  spaceBetween = 24,
  loop = false,
  slidesOffsetBefore = 16,
  slidesOffsetAfter = 16,
  style = {},
}) => {
  return (
    <Swiper
      spaceBetween={spaceBetween}
      slidesPerView={slidesPerView}
      loop={loop}
      slidesOffsetBefore={slidesOffsetBefore}
      slidesOffsetAfter={slidesOffsetAfter}
      onSlideChange={() => {}}
      style={style}
    >
      {children}
    </Swiper>
  );
};

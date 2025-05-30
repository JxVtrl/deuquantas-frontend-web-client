import { useRouter } from 'next/router';
import React from 'react';
import { SwiperSlide } from 'swiper/react';
import { Carousel } from '../Carousel';
import { MaxWidthWrapper } from '@deuquantas/components';
import { useComanda } from '@/contexts/ComandaContext';
interface NavigationPill {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  hasArrowBack?: boolean;
}

const Pill: React.FC<NavigationPill> = ({
  label,
  isActive,
  onClick,
  hasArrowBack,
}) => (
  <button
    onClick={onClick}
    style={{
      borderColor: isActive
        ? '#FFCC00'
        : hasArrowBack
          ? '#00000040'
          : '#000000',
      backgroundColor: isActive
        ? '#FFCC00'
        : hasArrowBack
          ? 'transparent'
          : '#ffffff',
      fontWeight: isActive ? 'bold' : hasArrowBack ? 500 : 'normal',
      borderRadius: hasArrowBack ? '6px' : '32px',
    }}
    className={`h-[24px] px-${hasArrowBack ? '[16px]' : 4} flex items-center justify-center
    whitespace-nowrap border border-solid hover:bg-[#FFCC00] hover:border-[#FFCC00] hover:font-bold
     transition-all duration-300`}
  >
    <p className={`text-[14px] leading-[140%] text-center`}>{label}</p>
  </button>
);

export const NavigationPills: React.FC<{
  navigationPills: NavigationPill[];
  hasArrowBack?: boolean;
}> = ({ navigationPills, hasArrowBack = false }) => {
  const router = useRouter();
  const { comanda } = useComanda();
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {hasArrowBack && (
        <MaxWidthWrapper>
          <div
            onClick={() => {
              router.push(`/conta/${comanda?.id}`);
            }}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: '1px solid #F0F0F0',
              paddingBottom: 12,
              paddingTop: 6,
              marginTop: 20,
            }}
          >
            <svg
              width='17'
              height='16'
              viewBox='0 0 17 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4.325 9L9.925 14.6L8.5 16L0.5 8L8.5 0L9.925 1.4L4.325 7H16.5V9H4.325Z'
                fill='#1D1B20'
              />
            </svg>
            <p className='text-[14px] leading-[140%] font-bold text-center'>
              Painel
            </p>
          </div>
        </MaxWidthWrapper>
      )}
      {navigationPills.length > 0 && (
        <MaxWidthWrapper
          style={{
            borderBottom: hasArrowBack ? 'none' : '1px solid #F0F0F0',
            marginTop: 20,
          }}
          styleContent={{
            padding: 0,
          }}
        >
          <Carousel
            slidesPerView={'auto'}
            style={{
              padding: hasArrowBack ? '0 0 20px' : '6px 0 12px',
            }}
            spaceBetween={hasArrowBack ? 6 : 8}
          >
            {navigationPills.map((pill) => (
              <SwiperSlide
                key={pill.label}
                style={{
                  width: 'fit-content',
                }}
              >
                <Pill {...pill} hasArrowBack={hasArrowBack} />
              </SwiperSlide>
            ))}
          </Carousel>
        </MaxWidthWrapper>
      )}
    </div>
  );
};

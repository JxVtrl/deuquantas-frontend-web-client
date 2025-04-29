import { Carousel } from '@/components/Carousel';
import { ActionRounded, MaxWidthWrapper, Title } from '@deuquantas/components';
import { SwiperSlide } from 'swiper/react';

interface Place {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

export const FavoritePlaces = () => {
  const places: Place[] = [
    { id: '1', name: 'Bar do Gomez' },
    { id: '2', name: 'Braseiro' },
    { id: '3', name: 'Belmonte' },
    { id: '4', name: 'Quartinho' },
    { id: '5', name: 'Rio Tap' },
  ];

  return (
    <>
      <MaxWidthWrapper style={{ marginBottom: 12 }}>
        <Title title='Locais favoritos' />
      </MaxWidthWrapper>
      <MaxWidthWrapper
        styleContent={{
          padding: 0,
        }}
      >
        <Carousel>
          {places.map((place) => (
            <SwiperSlide
              key={place.id}
              style={{
                width: 'fit-content',
              }}
            >
              <ActionRounded {...place} />
            </SwiperSlide>
          ))}
        </Carousel>
      </MaxWidthWrapper>
    </>
  );
};

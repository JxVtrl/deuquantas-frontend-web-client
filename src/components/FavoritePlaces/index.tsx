import React from 'react';
import { DrinksIcon } from '@/components/Icons';
import { MaxWidthLayout } from '@/layout';

interface Place {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

const PlaceItem: React.FC<Place> = ({ name, icon = <DrinksIcon /> }) => (
  <div className='flex flex-col items-center w-[60px]'>
    <div className='w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center border-2 border-[#FFCC00] bg-[#F0F0F0] shadow-lg transform hover:scale-105 transition-transform duration-200 cursor-pointer'>
      {icon}
    </div>
    <div className='text-xs text-center h-[36px] flex items-center justify-center'>
      {name}
    </div>
  </div>
);

export const FavoritePlaces: React.FC = () => {
  const places: Place[] = [
    { id: '1', name: 'Bar do Gomez' },
    { id: '2', name: 'Braseiro' },
    { id: '3', name: 'Belmonte' },
    { id: '4', name: 'Quartinho' },
    { id: '5', name: 'Rio Tap' },
  ];

  return (
    <>
      <MaxWidthLayout>
        <h2 className='text-[11px] leading-[24px] font-[500]'>
          Locais favoritos
        </h2>
      </MaxWidthLayout>
      <div className='flex flex-row gap-[24px] pt-[12px] pb-[6px] px-[16px] overflow-x-auto max-w-[1024px] mx-auto'>
        {places.map((place) => (
          <PlaceItem key={place.id} {...place} />
        ))}
      </div>
    </>
  );
};

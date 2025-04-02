import React from 'react';
import { LocationIcon } from '@/components/Icons';
import { MaxWidthLayout } from '@/layout';

interface Place {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

const PlaceItem: React.FC<Place> = ({ name, icon = <LocationIcon /> }) => (
  <div className='flex flex-col items-center min-w-[80px]'>
    <div className='w-20 h-20 bg-white rounded-full flex items-center justify-center mb-2 border-2 border-[#F5B800]'>
      {icon}
    </div>
    <div className='text-xs text-center'>{name}</div>
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
    <MaxWidthLayout>
      <div>
        <h2 className='text-[11px] leading-[24px] font-[500] mb-[12px]'>
          Locais favoritos
        </h2>
        <div className='flex gap-[24px] overflow-x-auto pb-[6px]'>
          {places.map((place) => (
            <PlaceItem key={place.id} {...place} />
          ))}
        </div>
      </div>
    </MaxWidthLayout>
  );
};

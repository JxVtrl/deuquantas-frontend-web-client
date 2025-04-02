import React from 'react';
import { LocationIcon } from '@/components/Icons';

interface Place {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

interface FavoritePlacesProps {
  places: Place[];
}

const PlaceItem: React.FC<Place> = ({ name, icon = <LocationIcon /> }) => (
  <div className='flex flex-col items-center min-w-[80px]'>
    <div className='w-20 h-20 bg-white rounded-full flex items-center justify-center mb-2 border-2 border-[#F5B800]'>
      {icon}
    </div>
    <div className='text-xs text-center'>{name}</div>
  </div>
);

export const FavoritePlaces: React.FC<FavoritePlacesProps> = ({ places }) => {
  return (
    <div className='px-4 py-6'>
      <h2 className='text-lg font-bold mb-4'>Locais favoritos</h2>
      <div className='flex gap-4 overflow-x-auto pb-4'>
        {places.map((place) => (
          <PlaceItem key={place.id} {...place} />
        ))}
      </div>
    </div>
  );
};

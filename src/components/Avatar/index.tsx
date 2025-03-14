import React from 'react';
import {
  Avatar as AvatarLayout,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

const Avatar: React.FC = () => {
  return (
    <AvatarLayout>
      <AvatarImage src='https://github.com/shadcn.png' />
      <AvatarFallback>CN</AvatarFallback>
    </AvatarLayout>
  );
};

export default Avatar;

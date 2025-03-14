import React from 'react';
import {
  Avatar as AvatarLayout,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { AvatarProps } from '@radix-ui/react-avatar';

const Avatar: React.FC<AvatarProps> = (props) => {
  return (
    <AvatarLayout {...props}>
      <AvatarImage src='https://github.com/shadcn.png' />
      <AvatarFallback>CN</AvatarFallback>
    </AvatarLayout>
  );
};

export default Avatar;

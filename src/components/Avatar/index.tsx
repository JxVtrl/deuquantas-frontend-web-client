import React from 'react';
import {
  Avatar as AvatarLayout,
  AvatarFallback,
  // AvatarImage,
} from '@/components/ui/avatar';
import { AvatarProps } from '@radix-ui/react-avatar';
import { useAuth } from '@/contexts/AuthContext';

const Avatar: React.FC<AvatarProps> = (props) => {
  const { user } = useAuth();
  const firstLetter = user?.nome.charAt(0).toUpperCase() || 'DQ';
  // const avatarUrl = user?.avatar || '';

  return (
    <AvatarLayout {...props}>
      {/* <AvatarImage src={avatarUrl} /> */}
      <AvatarFallback className='font-[700] text-[12px] leading-[12px]'>
        {firstLetter}
      </AvatarFallback>
    </AvatarLayout>
  );
};

export default Avatar;

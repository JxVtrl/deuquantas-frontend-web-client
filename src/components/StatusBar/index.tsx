import React from 'react';
import { MaxWidthLayout } from '@/layout';

type StatusBarProps = {
  isEstablishment?: boolean;
};

export const StatusBar: React.FC<StatusBarProps> = ({
  isEstablishment = false,
}) => {
  return (
    <MaxWidthLayout backgroundColor={isEstablishment ? '#000' : '#FFCC00'}>
      <div className='px-4 py-2'>
        {/* Status bar is now empty as it will be handled by the device */}
      </div>
    </MaxWidthLayout>
  );
};

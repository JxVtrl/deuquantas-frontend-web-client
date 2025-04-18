import React from 'react';
import { MaxWidthWrapper } from '@deuquantas/components';

export const StatusBar: React.FC = () => {
  return (
    <MaxWidthWrapper backgroundColor={'#FFCC00'}>
      <div className='px-4 py-2'>
        {/* Status bar is now empty as it will be handled by the device */}
      </div>
    </MaxWidthWrapper>
  );
};

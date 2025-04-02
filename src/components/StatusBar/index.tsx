import React from 'react';
import MaxWidthLayout from '@/layout/MaxWidthLayout';
export const StatusBar: React.FC = () => {
  return (
    <MaxWidthLayout backgroundColor='#FFCC00'>
      <div className='px-4 py-2'>
        {/* Status bar is now empty as it will be handled by the device */}
      </div>
    </MaxWidthLayout>
  );
};

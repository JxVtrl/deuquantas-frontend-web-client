import React from 'react';
import { SectionTitleProps } from './SectionTitle.interface';

const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <p className='text-[14px] font-[300] text-black mb-[24px] h-[17px]'>
      {title}
    </p>
  );
};

export default SectionTitle;

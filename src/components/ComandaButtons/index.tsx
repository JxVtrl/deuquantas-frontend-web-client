import { MaxWidthLayout } from '@/layout';
import React from 'react';
import { conta_buttons_navigation } from '@/data/conta_buttons_navigation.data';
import Button from '../Button';

const ComandaButtons: React.FC = () => {
  const left_button_class = 'rounded-l-md rounded-r-none';
  const right_button_class = 'rounded-r-md rounded-l-none';
  const middle_button_class = 'rounded-none';
  const shared_button_class =
    'place-items-center flex flex-row items-center gap-[10px] justify-center h-[48px]';

  return (
    <MaxWidthLayout>
      <div className='grid grid-cols-3 gap-[2px] w-full max-w-[500px] my-[20px] h-[48px]'>
        {conta_buttons_navigation.map((button, index) => (
          <Button
            key={button.href}
            variant='menu'
            className={`${shared_button_class} ${
              index === 0
                ? left_button_class
                : index === conta_buttons_navigation.length - 1
                  ? right_button_class
                  : middle_button_class
            }`}
            icon={button.icon}
            text={button.title}
            href={button.href}
          />
        ))}
      </div>
    </MaxWidthLayout>
  );
};

export default ComandaButtons;

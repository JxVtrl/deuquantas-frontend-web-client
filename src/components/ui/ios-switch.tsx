import React from 'react';
import { cn } from '@/lib/utils';

interface IOSSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

export const IOSSwitch: React.FC<IOSSwitchProps> = ({
  className,
  label,
  description,
  checked,
  onChange,
  ...props
}) => {
  return (
    <div
      className='flex items-center justify-between py-2 cursor-pointer'
      onClick={() =>
        onChange &&
        onChange({
          target: { checked: !checked },
        } as React.ChangeEvent<HTMLInputElement>)
      }
    >
      <div className='space-y-0.5'>
        {label && <label className='text-sm font-medium'>{label}</label>}
        {description && <p className='text-xs text-gray-500'>{description}</p>}
      </div>
      <div
        className={cn(
          'relative inline-flex h-6 w-[70px] items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-[#FFCC00]' : 'bg-gray-200',
          className,
        )}
      >
        <input
          type='checkbox'
          className='sr-only'
          checked={checked}
          onChange={onChange}
          {...props}
        />
        <span
          className={cn(
            'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1',
          )}
        />
      </div>
    </div>
  );
};

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'underline';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', ...props }, ref) => {
    return (
      <div className='relative'>
        <input
          type={type}
          className={cn(
            'flex h-9 w-full bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm relative z-10',
            variant === 'default' &&
              'rounded-md border border-input shadow-sm focus-visible:ring-1 focus-visible:ring-ring',
            variant === 'underline' && [
              'border-0 border-b-2 focus-visible:border-b-2 focus-visible:ring-0 focus-visible:ring-offset-0 border-black dark:border-white rounded-none',
              'focus:border-brand-yellow transition-all duration-300',
              'before:absolute before:left-0 before:bottom-0 before:h-0 before:w-full before:bg-brand-yellow/10',
              'before:transition-all before:duration-300 focus:before:h-full',
              'after:absolute after:left-1/2 after:bottom-0 after:h-[2px] after:w-0',
              'after:bg-brand-yellow after:transition-all after:duration-300',
              'focus:after:left-0 focus:after:w-full',
              'group',
            ],
            className,
          )}
          ref={ref}
          {...props}
        />
        <div
          className={cn(
            'absolute bottom-0 left-0 h-0 w-full bg-brand-yellow/5',
            'transition-all duration-500 ease-out',
            'pointer-events-none',
            'group-focus-within:h-full',
          )}
        />
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };

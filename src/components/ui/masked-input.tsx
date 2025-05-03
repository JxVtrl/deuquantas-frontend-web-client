import React from 'react';
import { masks, MaskType } from '@/config/masks';

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  maskType: MaskType;
  error?: boolean;
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ maskType, error, className, onChange, value, ...props }, ref) => {
    const applyMask = (inputValue: string) => {
      const mask = masks[maskType];
      const numbers = inputValue.replace(/\D/g, '');
      let maskedValue = '';
      let numberIndex = 0;

      for (let i = 0; i < mask.length && numberIndex < numbers.length; i++) {
        if (mask[i] === '9') {
          maskedValue += numbers[numberIndex];
          numberIndex++;
        } else {
          maskedValue += mask[i];
        }
      }

      return maskedValue;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = applyMask(e.target.value);
      if (onChange) {
        e.target.value = maskedValue;
        onChange(e);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Permite apenas números e teclas de controle
      if (
        !/^\d$/.test(e.key) &&
        ![
          'Backspace',
          'Delete',
          'ArrowLeft',
          'ArrowRight',
          'Tab',
          '-',
        ].includes(e.key)
      ) {
        e.preventDefault();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text');
      const maskedValue = applyMask(pastedData);
      if (onChange) {
        // Cria um evento sintético para atualizar o estado do pai corretamente
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: maskedValue,
            name: props.name,
          },
        };
        onChange(syntheticEvent as any);
      }
    };

    return (
      <input
        ref={ref}
        type='text'
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className || ''}
        `}
        {...props}
      />
    );
  },
);

MaskedInput.displayName = 'MaskedInput';

import React, { useState } from 'react';

interface CodeInputProps {
  onSubmit: (code: string) => void;
  isLoading?: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onSubmit(code.trim());
      setIsInputVisible(false);
      setCode('');
    }
  };

  return (
    <div className='px-4 absolute bottom-8 left-0 right-0 space-y-4'>
      {isInputVisible ? (
        <form onSubmit={handleSubmit} className='w-full space-y-4'>
          <input
            type='text'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder='Digite o código da mesa'
            className='w-full px-4 py-4 bg-[#1E1E1E] text-white rounded-lg font-medium text-center focus:outline-none focus:ring-2 focus:ring-[#FFCC00] placeholder-gray-400'
            autoFocus
          />
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={() => {
                setIsInputVisible(false);
                setCode('');
              }}
              className='flex-1 py-4 rounded-lg bg-[#1E1E1E] text-white font-medium'
            >
              Cancelar
            </button>
            <button
              type='submit'
              disabled={!code.trim() || isLoading}
              className='flex-1 py-4 rounded-lg bg-[#FFCC00] font-medium disabled:opacity-50'
            >
              Confirmar
            </button>
          </div>
        </form>
      ) : (
        <button
          type='button'
          onClick={() => setIsInputVisible(true)}
          disabled={isLoading}
          className='w-full bg-[#1E1E1E] text-white py-4 rounded-lg font-medium text-center disabled:opacity-50'
        >
          INSERIR CÓDIGO
        </button>
      )}
    </div>
  );
};

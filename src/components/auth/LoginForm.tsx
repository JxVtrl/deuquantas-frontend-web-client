import React from 'react';
import Button from '../Button';

interface LoginFormProps {
  email: string;
  senha: string;
  loading: boolean;
  error?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({
  email,
  senha,
  loading,
  error,
  onInputChange,
  onSubmit,
}: LoginFormProps) {
  const list_of_inputs = [
    {
      id: 'email',
      type: 'email',
      label: 'E-mail',
      placeholder: 'your-email@email.com',
    },
    {
      id: 'senha',
      type: 'password',
      label: 'Senha',
      placeholder: '••••••••••',
    },
  ];

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {error}
        </div>
      )}
      <div className='flex flex-col gap-[12px] mb-[32px]'>
        {list_of_inputs.map((input) => (
          <div key={input.id}>
            <label
              htmlFor={input.id}
              className='block text-[#272727] mb-[6px] text-[12px] leading-[120%] font-[500]'
            >
              {input.label}
            </label>
            <input
              id={input.id}
              type={input.type}
              value={input.id === 'email' ? email : senha}
              onChange={onInputChange}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500
                placeholder:text-[#A1A1AA] placeholder:text-[14px] placeholder:leading-[140%] placeholder:font-[400]
              '
              required
              placeholder={input.placeholder}
            />
          </div>
        ))}
      </div>

      <div className='flex flex-col gap-[12px]'>
        <Button
          disabled={loading}
          variant='primary'
          text={loading ? 'Entrando...' : 'Entrar'}
        />
        <Button
          disabled={loading}
          variant='secondary'
          text={loading ? 'Entrando...' : 'Entrar com Google'}
        />
      </div>
    </form>
  );
}

import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button';

interface LoginFormData {
  email: string;
  senha: string;
}

interface LoginFormProps {
  loading: boolean;
  error?: string;
  onSubmit: (data: LoginFormData) => void;
}

export function LoginForm({ loading, error, onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const list_of_inputs: Array<{
    id: keyof LoginFormData;
    type: string;
    label: string;
    placeholder: string;
  }> = [
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
    <form onSubmit={handleSubmit(onSubmit)}>
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
              {...register(input.id, {
                required: 'Este campo é obrigatório',
                ...(input.id === 'email' && {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'E-mail inválido',
                  },
                }),
              })}
              id={input.id}
              type={input.type}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500
                placeholder:text-[#A1A1AA] placeholder:text-[14px] placeholder:leading-[140%] placeholder:font-[400]
              '
              placeholder={input.placeholder}
            />
            {errors[input.id as keyof LoginFormData] && (
              <span className='text-red-500 text-xs mt-1'>
                {errors[input.id as keyof LoginFormData]?.message}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className='flex flex-col gap-[12px]'>
        <Button
          disabled={loading}
          variant='primary'
          text={loading ? 'Entrando...' : 'Entrar'}
          type='submit'
        />
        <Button
          disabled={loading}
          variant='secondary'
          text={loading ? 'Entrando...' : 'Entrar com Google'}
          type='button'
        />
      </div>
    </form>
  );
}

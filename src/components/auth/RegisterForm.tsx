import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button';

interface RegisterFormData {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  confirmSenha: string;
}

interface RegisterFormProps {
  loading: boolean;
  error?: string;
  onSubmit: (data: RegisterFormData) => void;
}

export function RegisterForm({ loading, error, onSubmit }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const senha = watch('senha');

  const list_of_inputs: Array<{
    id: keyof RegisterFormData;
    type: string;
    label: string;
    placeholder: string;
  }> = [
    {
      id: 'nome',
      type: 'text',
      label: 'Nome Completo',
      placeholder: 'Digite seu nome completo',
    },
    {
      id: 'email',
      type: 'email',
      label: 'E-mail',
      placeholder: 'Digite seu e-mail',
    },
    {
      id: 'telefone',
      type: 'tel',
      label: 'Telefone (opcional)',
      placeholder: 'Digite seu telefone',
    },
    {
      id: 'senha',
      type: 'password',
      label: 'Senha',
      placeholder: 'Digite sua senha',
    },
    {
      id: 'confirmSenha',
      type: 'password',
      label: 'Confirmar Senha',
      placeholder: 'Confirme sua senha',
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
              htmlFor={input.id.toString()}
              className='block text-[#272727] mb-[6px] text-[12px] leading-[120%] font-[500]'
            >
              {input.label}
            </label>
            <input
              {...register(input.id, {
                required:
                  input.id !== 'telefone' ? 'Este campo é obrigatório' : false,
                ...(input.id === 'email' && {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'E-mail inválido',
                  },
                }),
                ...(input.id === 'confirmSenha' && {
                  validate: (value: string) =>
                    value === senha || 'As senhas não coincidem',
                }),
                ...(input.id === 'senha' && {
                  minLength: {
                    value: 6,
                    message: 'A senha deve ter no mínimo 6 caracteres',
                  },
                }),
              })}
              type={input.type}
              id={input.id.toString()}
              placeholder={input.placeholder}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500
                placeholder:text-[#A1A1AA] placeholder:text-[14px] placeholder:leading-[140%] placeholder:font-[400]
              '
            />
            {errors[input.id as keyof RegisterFormData] && (
              <span className='text-red-500 text-xs mt-1'>
                {errors[input.id as keyof RegisterFormData]?.message}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className='flex flex-col gap-[12px]'>
        <Button
          disabled={loading}
          variant='primary'
          text={loading ? 'Registrando...' : 'Registrar'}
          type='submit'
        />
      </div>
    </form>
  );
}

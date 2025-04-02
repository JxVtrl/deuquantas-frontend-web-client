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
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    mode: 'onChange',
  });

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

  const getErrorMessage = (field: keyof RegisterFormData) => {
    if (errors[field]) {
      return errors[field]?.message;
    }
    if (error && field === 'email') {
      return 'Este e-mail já está em uso. Por favor, use outro e-mail.';
    }
    return '';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && !errors.email && (
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
                    message: 'Digite um e-mail válido',
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500
                placeholder:text-[#A1A1AA] placeholder:text-[14px] placeholder:leading-[140%] placeholder:font-[400]
                ${errors[input.id] ? 'border-red-500' : 'border-gray-300'}
              `}
            />
            {getErrorMessage(input.id) && (
              <span className='text-red-500 text-xs mt-1'>
                {getErrorMessage(input.id)}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className='flex flex-col gap-[12px]'>
        <Button
          disabled={loading || isSubmitting}
          variant='primary'
          text={loading || isSubmitting ? 'Registrando...' : 'Registrar'}
          type='submit'
        />
      </div>
    </form>
  );
}

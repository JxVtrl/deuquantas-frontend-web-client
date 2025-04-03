import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm() {
  const { login, register: regFunc } = useAuth();
  const router = useRouter();
  const {
    loading,
    error,
    handleSubmit: onSubmit,
  } = useAuthForm({
    login,
    register: regFunc,
    onSuccess: () => router.push('/customer/home'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: 'onChange',
  });

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
      id: 'password',
      type: 'password',
      label: 'Senha',
      placeholder: '••••••••••',
    },
  ];

  const getErrorMessage = (field: keyof LoginFormData) => {
    if (errors[field]) {
      return errors[field]?.message;
    }
    if (error && field === 'email') {
      return 'E-mail ou senha incorretos. Verifique suas credenciais.';
    }
    return '';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
                    message: 'Digite um e-mail válido',
                  },
                }),
              })}
              id={input.id}
              type={input.type}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500
                placeholder:text-[#A1A1AA] placeholder:text-[14px] placeholder:leading-[140%] placeholder:font-[400]
                ${errors[input.id] ? 'border-red-500' : 'border-gray-300'}
              `}
              placeholder={input.placeholder}
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
          text={loading || isSubmitting ? 'Entrando...' : 'Entrar'}
          type='submit'
        />
        <Button
          disabled={loading || isSubmitting}
          variant='secondary'
          text={loading || isSubmitting ? 'Entrando...' : 'Entrar com Google'}
          type='button'
        />
      </div>
    </form>
  );
}

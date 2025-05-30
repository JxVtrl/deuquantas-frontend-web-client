import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@deuquantas/components';
import { login_inputs, LoginFormData } from '@/data/login_inputs';
import { useAuthFormContext } from '@/contexts/AuthFormContext';

export function LoginForm() {
  const {
    loading,
    error,
    handleSubmit: onSubmit,
    toggleForm,
  } = useAuthFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    mode: 'onChange',
  });

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
        {login_inputs.map((input) => (
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
      </div>

      <div className='mt-[12px] text-end flex flex-col gap-[12px]'>
        <p className='text-[#272727] text-[12px] leading-[120%] font-[500]'>
          Não tem uma conta?{' '}
          <span
            className='underline cursor-pointer font-[700]'
            onClick={toggleForm}
          >
            Cadastrar
          </span>
        </p>
      </div>
    </form>
  );
}

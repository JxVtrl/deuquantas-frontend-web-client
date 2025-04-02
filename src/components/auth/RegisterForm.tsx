import React from 'react';
import Button from '../Button';

interface RegisterFormProps {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  confirmSenha: string;
  loading: boolean;
  error?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegisterForm({
  nome,
  email,
  telefone,
  senha,
  confirmSenha,
  loading,
  error,
  onInputChange,
  onSubmit,
}: RegisterFormProps) {
  const list_of_inputs = [
    {
      id: 'nome',
      type: 'text',
      label: 'Nome Completo',
      placeholder: 'Digite seu nome completo',
      value: nome,
    },
    {
      id: 'email',
      type: 'email',
      label: 'E-mail',
      placeholder: 'Digite seu e-mail',
      value: email,
    },
    {
      id: 'telefone',
      type: 'tel',
      label: 'Telefone (opcional)',
      placeholder: 'Digite seu telefone',
      value: telefone,
    },
    {
      id: 'senha',
      type: 'password',
      label: 'Senha',
      placeholder: 'Digite sua senha',
      value: senha,
    },
    {
      id: 'confirmSenha',
      type: 'password',
      label: 'Confirmar Senha',
      placeholder: 'Confirme sua senha',
      value: confirmSenha,
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
              type={input.type}
              id={input.id}
              placeholder={input.placeholder}
              onChange={onInputChange}
              value={input.value}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500
                placeholder:text-[#A1A1AA] placeholder:text-[14px] placeholder:leading-[140%] placeholder:font-[400]
              '
            />
          </div>
        ))}
      </div>

      <div className='flex flex-col gap-[12px]'>
        <Button
          disabled={loading}
          variant='primary'
          text={loading ? 'Registrando...' : 'Registrar'}
          onClick={onSubmit}
        />
      </div>
    </form>
  );
}

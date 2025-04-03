import React from 'react';
import { useForm } from 'react-hook-form';

export interface RegisterEstablishmentFormData {
  // Dados do usuário
  nome: string;
  email: string;
  senha: string;
  confirmSenha: string;

  // Dados do estabelecimento
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  telefone: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface RegisterEstablishmentData {
  usuario: {
    nome: string;
    email: string;
    senha: string;
  };
  estabelecimento: {
    nomeFantasia: string;
    razaoSocial: string;
    cnpj: string;
    telefone: string;
    endereco: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

const RegisterEstablishmentForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterEstablishmentFormData>();

  const onSubmit = (data: RegisterEstablishmentFormData) => {
    console.log(data);
  };

  const list_of_inputs = [
    {
      id: 'nome' as const,
      label: 'Nome',
      type: 'text',
    },
    {
      id: 'email' as const,
      label: 'E-mail',
      type: 'email',
    },
    {
      id: 'telefone' as const,
      label: 'Telefone',
      type: 'tel',
    },
    {
      id: 'nomeFantasia' as const,
      label: 'Nome Fantasia',
      type: 'text',
    },
    {
      id: 'razaoSocial' as const,
      label: 'Razão Social',
      type: 'text',
    },
    {
      id: 'cnpj' as const,
      label: 'CNPJ',
      type: 'text',
    },
    {
      id: 'endereco' as const,
      label: 'Endereço',
      type: 'text',
    },
    {
      id: 'numero' as const,
      label: 'Número',
      type: 'text',
    },
    {
      id: 'complemento' as const,
      label: 'Complemento',
      type: 'text',
    },
    {
      id: 'bairro' as const,
      label: 'Bairro',
      type: 'text',
    },
    {
      id: 'cidade' as const,
      label: 'Cidade',
      type: 'text',
    },
    {
      id: 'estado' as const,
      label: 'Estado',
      type: 'text',
    },
    {
      id: 'cep' as const,
      label: 'CEP',
      type: 'text',
    },
    {
      id: 'senha' as const,
      label: 'Senha',
      type: 'password',
    },
    {
      id: 'confirmSenha' as const,
      label: 'Confirmar Senha',
      type: 'password',
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.email && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {errors.email.message}
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
                required:
                  input.id !== 'telefone' ? 'Este campo é obrigatório' : false,
                ...(input.id === 'email' && {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Digite um e-mail válido',
                  },
                }),
                ...(input.id === 'confirmSenha' && {
                  validate: (value) =>
                    value === watch('senha') || 'As senhas não coincidem',
                }),
                ...(input.id === 'senha' && {
                  minLength: {
                    value: 6,
                    message: 'A senha deve ter no mínimo 6 caracteres',
                  },
                }),
              })}
              type={input.type}
              id={input.id}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500
                placeholder:text-[#A1A1AA] placeholder:text-[14px] placeholder:leading-[140%] placeholder:font-[400]
                ${errors[input.id] ? 'border-red-500' : 'border-gray-300'}
              `}
            />
            {errors[input.id]?.message && (
              <span className='text-red-500 text-xs mt-1'>
                {errors[input.id]?.message}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className='flex flex-col gap-[12px]'>
        <button
          disabled={isSubmitting}
          className='w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50'
          type='submit'
        >
          {isSubmitting ? 'Registrando...' : 'Registrar'}
        </button>
      </div>
    </form>
  );
};

export default RegisterEstablishmentForm;

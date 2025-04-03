import React from 'react';
import { useForm } from 'react-hook-form';
import { useFormSteps } from '@/hooks/useFormSteps';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

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

const steps = [
  {
    id: 'usuario',
    title: 'Registro de Estabelecimento',
    fields: ['nome', 'email', 'senha', 'confirmSenha'],
  },
  {
    id: 'estabelecimento',
    title: 'Dados do Estabelecimento',
    fields: ['nomeFantasia', 'razaoSocial', 'cnpj', 'telefone'],
  },
  {
    id: 'endereco',
    title: 'Dados do Endereço',
    fields: [
      'endereco',
      'numero',
      'complemento',
      'bairro',
      'cidade',
      'estado',
      'cep',
    ],
  },
];

const RegisterEstablishmentForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm<RegisterEstablishmentFormData>();

  const {
    currentStep,
    currentStepData,
    nextStep,
    previousStep,
    isFirstStep,
    isLastStep,
    totalSteps,
  } = useFormSteps(steps);

  const onSubmit = async (data: RegisterEstablishmentFormData) => {
    if (!isLastStep) {
      const isValid = await trigger(
        currentStepData.fields as Array<keyof RegisterEstablishmentFormData>,
      );
      if (isValid) {
        nextStep();
      }
    } else {
      console.log(data);
      // Aqui você implementará a lógica de envio do formulário
    }
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      nome: 'Nome Completo',
      email: 'E-mail',
      senha: 'Senha',
      confirmSenha: 'Confirmar Senha',
      nomeFantasia: 'Nome Fantasia',
      razaoSocial: 'Razão Social',
      cnpj: 'CNPJ',
      telefone: 'Telefone',
      endereco: 'Endereço',
      numero: 'Número',
      complemento: 'Complemento',
      bairro: 'Bairro',
      cidade: 'Cidade',
      estado: 'Estado',
      cep: 'CEP',
    };
    return labels[field] || field;
  };

  const getFieldType = (field: string) => {
    if (field === 'email') return 'email';
    if (field === 'senha' || field === 'confirmSenha') return 'password';
    if (field === 'telefone') return 'tel';
    return 'text';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='mb-6'>
        <h2 className='text-[#272727] text-[16px] font-[700] mb-2'>
          {currentStepData.title}
        </h2>
        <div className='flex items-center gap-2'>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index <= currentStep ? 'bg-[#FFCC00]' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode='wait'>
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className='flex flex-col gap-[12px] mb-[32px]'
        >
          {currentStepData.fields.map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className='block text-[#272727] mb-[6px] text-[12px] leading-[120%] font-[500]'
              >
                {getFieldLabel(field)}
              </label>
              <input
                {...register(field as keyof RegisterEstablishmentFormData, {
                  required:
                    field !== 'complemento'
                      ? 'Este campo é obrigatório'
                      : false,
                  ...(field === 'email' && {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Digite um e-mail válido',
                    },
                  }),
                  ...(field === 'confirmSenha' && {
                    validate: (value) =>
                      value === watch('senha') || 'As senhas não coincidem',
                  }),
                  ...(field === 'senha' && {
                    minLength: {
                      value: 6,
                      message: 'A senha deve ter no mínimo 6 caracteres',
                    },
                  }),
                })}
                type={getFieldType(field)}
                id={field}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500
                  placeholder:text-[#A1A1AA] placeholder:text-[14px] placeholder:leading-[140%] placeholder:font-[400]
                  ${errors[field as keyof RegisterEstablishmentFormData] ? 'border-red-500' : 'border-gray-300'}
                `}
              />
              {errors[field as keyof RegisterEstablishmentFormData]
                ?.message && (
                <span className='text-red-500 text-xs mt-1'>
                  {
                    errors[field as keyof RegisterEstablishmentFormData]
                      ?.message
                  }
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className='flex flex-col gap-[12px]'>
        <Button disabled={isSubmitting} type='submit' className='w-full'>
          {isSubmitting
            ? 'Processando...'
            : isLastStep
              ? 'Registrar'
              : 'Próximo'}
        </Button>
        {!isFirstStep && (
          <Button
            type='button'
            onClick={previousStep}
            variant='outline'
            className='w-full'
          >
            Voltar
          </Button>
        )}
      </div>
    </form>
  );
};

export default RegisterEstablishmentForm;

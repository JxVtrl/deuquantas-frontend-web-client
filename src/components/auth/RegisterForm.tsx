import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFormSteps } from '@/hooks/useFormSteps';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/axios';
import Cookies from 'js-cookie';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { useToast } from '@/components/ui/use-toast';

export interface RegisterFormData {
  // Dados do usuário
  nome: string;
  email: string;
  senha: string;
  confirmSenha: string;

  // Dados pessoais
  cpf: string;
  telefone: string;
  dataNascimento: string;
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

const steps = [
  {
    id: 'usuario',
    title: 'Registro de Cliente',
    fields: ['nome', 'email', 'senha', 'confirmSenha'],
  },
  {
    id: 'pessoal',
    title: 'Dados Pessoais',
    fields: ['cpf', 'telefone', 'dataNascimento'],
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

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<RegisterFormData>();

  const {
    currentStep,
    currentStepData,
    nextStep,
    previousStep,
    isFirstStep,
    isLastStep,
    totalSteps,
  } = useFormSteps(steps);

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    if (!isLastStep) {
      const isValid = await trigger(
        currentStepData.fields as Array<keyof RegisterFormData>,
      );
      if (isValid) {
        nextStep();
      }
    } else {
      try {
        setLoading(true);

        // Remove máscaras antes de enviar
        const cleanedData = {
          ...data,
          cpf: data.cpf.replace(/\D/g, ''),
          telefone: data.telefone.replace(/\D/g, ''),
          cep: data.cep.replace(/\D/g, ''),
        };

        // Registra o cliente com todos os dados
        const response = await api.post('/clientes', cleanedData);

        // Salva o token nos cookies
        Cookies.set('auth_token', response.data.token, { expires: 7 });

        // Configura o token para as próximas requisições
        api.defaults.headers.common['Authorization'] =
          `Bearer ${response.data.token}`;

        toast({
          title: 'Sucesso!',
          description: 'Cadastro realizado com sucesso.',
        });
      } catch (error) {
        console.error('Erro ao cadastrar:', error);
        toast({
          title: 'Erro!',
          description: 'Ocorreu um erro ao realizar o cadastro.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      nome: 'Nome Completo',
      email: 'E-mail',
      senha: 'Senha',
      confirmSenha: 'Confirmar Senha',
      cpf: 'CPF',
      telefone: 'Telefone',
      dataNascimento: 'Data de Nascimento',
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
    if (field === 'dataNascimento') return 'date';
    return 'text';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 w-full'>
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
            <div key={field} className='grid gap-2'>
              <Label htmlFor={field}>{getFieldLabel(field)}</Label>
              {field === 'cpf' ? (
                <MaskedInput
                  maskType='cpf'
                  {...register(field as keyof RegisterFormData)}
                  error={!!errors[field as keyof RegisterFormData]}
                  value={watch(field as keyof RegisterFormData) || ''}
                />
              ) : field === 'telefone' ? (
                <MaskedInput
                  maskType='telefone'
                  {...register(field as keyof RegisterFormData)}
                  error={!!errors[field as keyof RegisterFormData]}
                  value={watch(field as keyof RegisterFormData) || ''}
                />
              ) : field === 'cep' ? (
                <MaskedInput
                  maskType='cep'
                  {...register(field as keyof RegisterFormData)}
                  error={!!errors[field as keyof RegisterFormData]}
                  value={watch(field as keyof RegisterFormData) || ''}
                />
              ) : (
                <Input
                  {...register(field as keyof RegisterFormData, {
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
                    ${errors[field as keyof RegisterFormData] ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
              )}
              {errors[field as keyof RegisterFormData]?.message && (
                <p className='text-red-500 text-sm'>
                  {errors[field as keyof RegisterFormData]?.message}
                </p>
              )}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className='flex flex-col gap-[12px]'>
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
        <Button disabled={loading} type='submit' className='w-full'>
          {loading ? 'Cadastrando...' : isLastStep ? 'Registrar' : 'Próximo'}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;

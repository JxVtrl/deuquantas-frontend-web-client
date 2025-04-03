import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFormSteps } from '@/hooks/useFormSteps';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/axios';
import Cookies from 'js-cookie';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@radix-ui/react-label';
import { authService } from '@/services/auth.service';
import { validateCNPJ } from '@/utils/validators';
import { cepService } from '@/services/cep.service';

export interface RegisterEstablishmentFormData {
  // Dados do usuário
  nome: string;
  email: string;
  senha: string;
  confirmSenha: string;

  // Dados do estabelecimento
  nomeEstab: string;
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

const steps = [
  {
    id: 'usuario',
    title: 'Registro de Estabelecimento',
    fields: ['nome', 'email', 'senha', 'confirmSenha'],
  },
  {
    id: 'estabelecimento',
    title: 'Dados do Estabelecimento',
    fields: ['nomeEstab', 'cnpj', 'telefone'],
  },
  {
    id: 'endereco',
    title: 'Dados do Endereço',
    fields: [
      'cep',
      'endereco',
      'numero',
      'complemento',
      'bairro',
      'cidade',
      'estado',
    ],
  },
];

const RegisterEstablishmentForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setError,
    setValue,
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

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [searchingCep, setSearchingCep] = useState(false);
  const [checkingCNPJ, setCheckingCNPJ] = useState(false);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');

    if (cep.length === 8) {
      try {
        setSearchingCep(true);
        const address = await cepService.getAddressByCep(cep);

        setValue('endereco', address.endereco);
        setValue('bairro', address.bairro);
        setValue('cidade', address.cidade);
        setValue('estado', address.estado);
        setValue('cep', address.cep);
      } catch {
        toast({
          title: 'Erro!',
          description: 'CEP não encontrado ou inválido.',
          variant: 'destructive',
        });
      } finally {
        setSearchingCep(false);
      }
    }
  };

  const onSubmit = async (data: RegisterEstablishmentFormData) => {
    if (!isLastStep) {
      const isValid = await trigger(
        currentStepData.fields as Array<keyof RegisterEstablishmentFormData>,
      );

      if (isValid) {
        // Se estiver na primeira etapa, verifica o email
        if (currentStep === 0) {
          try {
            setCheckingEmail(true);
            const emailExists = await authService.checkEmailExists(data.email);
            if (emailExists) {
              setError('email', {
                type: 'manual',
                message: 'Este email já está cadastrado',
              });
              return;
            }
          } catch (error) {
            console.error('Erro ao verificar email:', error);
            toast({
              title: 'Erro!',
              description:
                'Não foi possível verificar o email. Tente novamente.',
              variant: 'destructive',
            });
            return;
          } finally {
            setCheckingEmail(false);
          }
        }

        // Se estiver na segunda etapa, verifica CNPJ
        if (currentStep === 1) {
          try {
            setCheckingCNPJ(true);
            const cnpjExists = await authService.checkCNPJExists(
              data.cnpj.replace(/\D/g, ''),
            );

            if (cnpjExists) {
              setError('cnpj', {
                type: 'manual',
                message: 'Este CNPJ já está cadastrado',
              });
              return;
            }
          } catch (error) {
            console.error('Erro ao verificar CNPJ:', error);
            toast({
              title: 'Erro!',
              description:
                'Não foi possível verificar o CNPJ. Tente novamente.',
              variant: 'destructive',
            });
            return;
          } finally {
            setCheckingCNPJ(false);
          }
        }

        nextStep();
      }
    } else {
      try {
        setLoading(true);

        // Remove máscaras antes de enviar
        const cleanedData = {
          ...data,
          numCnpj: data.cnpj.replace(/\D/g, ''),
          telefone: data.telefone.replace(/\D/g, ''),
          numCelular: data.telefone.replace(/\D/g, ''),
          cep: data.cep.replace(/\D/g, ''),
        };

        // Registra o estabelecimento com todos os dados
        const response = await api.post('/estabelecimentos', cleanedData);

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
      nomeEstab: 'Nome do Estabelecimento',
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
              {field === 'cnpj' ? (
                <MaskedInput
                  maskType='cnpj'
                  {...register(field as keyof RegisterEstablishmentFormData, {
                    required: 'Este campo é obrigatório',
                    validate: (value) => {
                      const numbers = value?.replace(/\D/g, '') || '';
                      if (numbers.length !== 14) return 'CNPJ inválido';
                      if (!validateCNPJ(numbers)) return 'CNPJ inválido';
                      return true;
                    },
                  })}
                  error={!!errors[field as keyof RegisterEstablishmentFormData]}
                  value={watch('cnpj') || ''}
                />
              ) : field === 'telefone' ? (
                <MaskedInput
                  maskType='telefone'
                  {...register(field as keyof RegisterEstablishmentFormData, {
                    required: 'Este campo é obrigatório',
                    validate: (value) => {
                      const numbers = value?.replace(/\D/g, '') || '';
                      return (
                        numbers.length === 10 ||
                        numbers.length === 11 ||
                        'Telefone inválido'
                      );
                    },
                  })}
                  error={!!errors[field as keyof RegisterEstablishmentFormData]}
                  value={watch('telefone') || ''}
                />
              ) : field === 'cep' ? (
                <MaskedInput
                  maskType='cep'
                  {...register(field as keyof RegisterEstablishmentFormData, {
                    required: 'Este campo é obrigatório',
                    validate: (value) => {
                      const numbers = value?.replace(/\D/g, '') || '';
                      return numbers.length === 8 || 'CEP inválido';
                    },
                  })}
                  error={!!errors[field as keyof RegisterEstablishmentFormData]}
                  value={
                    watch(field as keyof RegisterEstablishmentFormData) || ''
                  }
                  onChange={(e) => {
                    register(
                      field as keyof RegisterEstablishmentFormData,
                    ).onChange(e);
                    handleCepChange(e);
                  }}
                  disabled={searchingCep}
                />
              ) : field === 'endereco' ||
                field === 'bairro' ||
                field === 'cidade' ||
                field === 'estado' ? (
                <Input
                  {...register(field as keyof RegisterEstablishmentFormData, {
                    required: 'Este campo é obrigatório',
                  })}
                  type='text'
                  id={field}
                  readOnly
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                    ${errors[field as keyof RegisterEstablishmentFormData] ? 'border-red-500' : 'border-gray-300'}
                    bg-gray-100 cursor-not-allowed
                  `}
                />
              ) : (
                <Input
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
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                    ${errors[field as keyof RegisterEstablishmentFormData] ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
              )}
              {errors[field as keyof RegisterEstablishmentFormData]
                ?.message && (
                <p className='text-red-500 text-sm'>
                  {
                    errors[field as keyof RegisterEstablishmentFormData]
                      ?.message
                  }
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
        <Button
          disabled={loading || checkingEmail || checkingCNPJ}
          type='submit'
          className='w-full'
        >
          {loading
            ? 'Cadastrando...'
            : checkingEmail
              ? 'Verificando...'
              : checkingCNPJ
                ? 'Verificando...'
                : isLastStep
                  ? 'Registrar'
                  : 'Próximo'}
        </Button>
      </div>
    </form>
  );
};

export default RegisterEstablishmentForm;

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFormSteps } from '@/hooks/useFormSteps';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { useToast } from '@/components/ui/use-toast';
import { validateCPF } from '@/utils/validators';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/router';
import { cepService } from '@/services/cep.service';

export interface RegisterFormData {
  // Dados do usuário
  nome: string;
  email: string;
  password: string;
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
    fields: ['nome', 'email', 'password', 'confirmSenha'],
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

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setError,
    setValue,
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
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingDocument, setCheckingDocument] = useState(false);
  const [searchingCep, setSearchingCep] = useState(false);
  const router = useRouter();

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

  const onSubmit = async (data: RegisterFormData) => {
    if (!isLastStep) {
      const isValid = await trigger(
        currentStepData.fields as Array<keyof RegisterFormData>,
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
          } catch {
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

        // Se estiver na segunda etapa, verifica CPF e telefone
        if (currentStep === 1) {
          try {
            setCheckingDocument(true);
            const cpfExists = await authService.checkCPFExists(
              data.cpf.replace(/\D/g, ''),
            );
            const phoneExists = await authService.checkPhoneExists(
              data.telefone.replace(/\D/g, ''),
            );

            if (cpfExists) {
              setError('cpf', {
                type: 'manual',
                message: 'Este CPF já está cadastrado',
              });
              return;
            }

            if (phoneExists) {
              setError('telefone', {
                type: 'manual',
                message: 'Este telefone já está cadastrado',
              });
              return;
            }
          } catch {
            toast({
              title: 'Erro!',
              description:
                'Não foi possível verificar os dados. Tente novamente.',
              variant: 'destructive',
            });
            return;
          } finally {
            setCheckingDocument(false);
          }
        }

        nextStep();
      }
    } else {
      try {
        setLoading(true);

        // Remove máscaras antes de enviar
        const cleanedData = {
          nome: data.nome,
          email: data.email,
          password: data.password,
          telefone: data.telefone.replace(/\D/g, ''),
          numCpf: data.cpf.replace(/\D/g, ''),
          cep: data.cep.replace(/\D/g, ''),
          endereco: data.endereco,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
        };

        // Registra o cliente usando o authService
        await authService.register(cleanedData);

        toast({
          title: 'Sucesso!',
          description: 'Cadastro realizado com sucesso.',
        });

        // Redireciona para a página de login após 2 segundos
        setTimeout(() => {
          router.push('/auth');
        }, 2000);
      } catch (err) {
        console.error('Erro ao cadastrar:', err);
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
      password: 'Senha',
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
    if (field === 'password' || field === 'confirmSenha') return 'password';
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
                  {...register(field as keyof RegisterFormData, {
                    required: 'Este campo é obrigatório',
                    validate: (value) => {
                      const numbers = value?.replace(/\D/g, '') || '';
                      if (numbers.length !== 11) return 'CPF inválido';
                      return validateCPF(numbers) || 'CPF inválido';
                    },
                  })}
                  error={!!errors[field as keyof RegisterFormData]}
                  value={watch(field as keyof RegisterFormData) || ''}
                />
              ) : field === 'telefone' ? (
                <MaskedInput
                  maskType='telefone'
                  {...register(field as keyof RegisterFormData, {
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
                  error={!!errors[field as keyof RegisterFormData]}
                  value={watch(field as keyof RegisterFormData) || ''}
                />
              ) : field === 'cep' ? (
                <MaskedInput
                  maskType='cep'
                  {...register(field as keyof RegisterFormData, {
                    required: 'Este campo é obrigatório',
                    validate: (value) => {
                      const numbers = value?.replace(/\D/g, '') || '';
                      return numbers.length === 8 || 'CEP inválido';
                    },
                  })}
                  error={!!errors[field as keyof RegisterFormData]}
                  value={watch(field as keyof RegisterFormData) || ''}
                  onChange={(e) => {
                    register(field as keyof RegisterFormData).onChange(e);
                    handleCepChange(e);
                  }}
                  disabled={searchingCep}
                />
              ) : field === 'endereco' ||
                field === 'bairro' ||
                field === 'cidade' ||
                field === 'estado' ? (
                <Input
                  {...register(field as keyof RegisterFormData, {
                    required: 'Este campo é obrigatório',
                  })}
                  type='text'
                  id={field}
                  readOnly
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                    ${errors[field as keyof RegisterFormData] ? 'border-red-500' : 'border-gray-300'}
                    bg-gray-100 cursor-not-allowed
                  `}
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
                        value === watch('password') ||
                        'As senhas não coincidem',
                    }),
                    ...(field === 'password' && {
                      minLength: {
                        value: 6,
                        message: 'A senha deve ter no mínimo 6 caracteres',
                      },
                    }),
                  })}
                  type={getFieldType(field)}
                  id={field}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
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
        <Button
          disabled={loading || checkingEmail || checkingDocument}
          type='submit'
          className='w-full'
        >
          {loading
            ? 'Cadastrando...'
            : checkingEmail
              ? 'Verificando...'
              : checkingDocument
                ? 'Verificando...'
                : isLastStep
                  ? 'Registrar'
                  : 'Próximo'}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;

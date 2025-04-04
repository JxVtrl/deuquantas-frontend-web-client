import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useFormSteps } from '@/hooks/useFormSteps';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/axios';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@radix-ui/react-label';
import { authService } from '@/services/auth.service';
import { validateCNPJ } from '@/utils/validators';
import { cepService } from '@/services/cep.service';
import { useRouter } from 'next/navigation';

export interface RegisterEstablishmentFormData {
  // Dados do usuário
  name: string;
  email: string;
  password: string;
  confirmSenha: string;

  // Dados do estabelecimento
  nomeEstab: string;
  razaoSocial: string;
  numCnpj: string;
  numCelular: string; // Número de celular comercial do estabelecimento
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
    fields: ['email'],
  },
  {
    id: 'estabelecimento',
    title: 'Dados do Estabelecimento',
    fields: ['name', 'nomeEstab', 'razaoSocial', 'numCnpj', 'numCelular'],
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

const RegisterEstablishmentForm = () => {
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
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Reseta todos os estados quando o componente é montado
    setLoading(false);
    setCheckingEmail(false);
    setSearchingCep(false);
    setCheckingCNPJ(false);
    setUserName(null);

    // Reseta os campos do formulário
    setValue('email', '');
    setValue('password', '');
    setValue('confirmSenha', '');
    setValue('name', '');
    setValue('nomeEstab', '');
    setValue('razaoSocial', '');
    setValue('numCnpj', '');
    setValue('numCelular', '');
    setValue('endereco', '');
    setValue('numero', '');
    setValue('complemento', '');
    setValue('bairro', '');
    setValue('cidade', '');
    setValue('estado', '');
    setValue('cep', '');

    // Reseta os campos do primeiro passo
    if (steps[0].fields.includes('password')) {
      steps[0].fields = ['email'];
    }
  }, []); // Executa apenas quando o componente é montado

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
        if (currentStep === 0 && !steps[0].fields.includes('password')) {
          try {
            setCheckingEmail(true);
            const accountInfo = await authService.checkAccountType(data.email);

            if (accountInfo.hasEstabelecimentoAccount) {
              toast({
                title: 'Atenção!',
                description:
                  'Você já possui uma conta de estabelecimento. Por favor, faça login.',
              });
              router.push('/login');
              return;
            }

            if (accountInfo.hasClienteAccount) {
              console.log('tem conta de cliente');

              // Se tem conta de cliente, busca os dados do usuário
              const userData = await authService.getUserDataByEmail(data.email);

              console.log('userData', userData);

              if (userData) {
                setUserName(userData.name);
                setValue('name', userData.name);
              }

              // Mostra campos de senha e confirmação para criar nova conta
              if (!steps[0].fields.includes('password')) {
                steps[0].fields.push('password', 'confirmSenha');
              }
              nextStep();
              return;
            }

            // Se não tem nenhuma conta, mostra campos de senha e confirmação
            if (!steps[0].fields.includes('password')) {
              steps[0].fields.push('password', 'confirmSenha');
            }
            return;
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

        // Se estiver na segunda etapa, verifica CNPJ e número de celular
        if (currentStep === 1) {
          try {
            setCheckingCNPJ(true);
            const [cnpjExists, phoneExists] = await Promise.all([
              authService.checkCNPJExists(data.numCnpj.replace(/\D/g, '')),
              authService.checkEstablishmentPhoneExists(
                data.numCelular.replace(/\D/g, ''),
              ),
            ]);

            if (cnpjExists) {
              setError('numCnpj', {
                type: 'manual',
                message: 'Este CNPJ já está cadastrado',
              });
              return;
            }

            if (phoneExists) {
              setError('numCelular', {
                type: 'manual',
                message:
                  'Este número de celular já está cadastrado para outro estabelecimento',
              });
              return;
            }
          } catch (error) {
            console.error('Erro ao verificar CNPJ/Número de celular:', error);
            toast({
              title: 'Erro!',
              description:
                'Não foi possível verificar os dados. Tente novamente.',
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
          numCnpj: data.numCnpj.replace(/\D/g, ''),
          numCelular: data.numCelular.replace(/\D/g, ''),
          cep: data.cep.replace(/\D/g, ''),
        };

        // Registra o estabelecimento com todos os dados
        await api.post('/estabelecimentos', cleanedData);

        toast({
          title: 'Sucesso!',
          description:
            'Cadastro realizado com sucesso. Você será redirecionado para o login.',
        });

        // Redireciona para a página de login após 2 segundos
        setTimeout(() => {
          router.push('/login');
        }, 2000);
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
      name: 'Nome Completo',
      email: 'E-mail',
      password: 'Senha',
      confirmSenha: 'Confirmar Senha',
      nomeEstab: 'Nome Fantasia',
      razaoSocial: 'Razão Social',
      numCnpj: 'CNPJ',
      numCelular: 'Número de Celular Comercial',
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
    if (field === 'numCelular') return 'tel';
    return 'text';
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 w-full max-h-[calc(100vh-200px)] overflow-y-auto'
    >
      <div className='mb-6 sticky top-0 pb-4 z-10 border-b '>
        <h2 className='text-[#333333] text-[16px] font-[700] mb-2'>
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
              {field === 'name' && userName ? (
                <Input
                  {...register(field as keyof RegisterEstablishmentFormData)}
                  type='text'
                  id={field}
                  value={userName}
                  disabled
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background bg-gray-100 cursor-not-allowed'
                />
              ) : field === 'email' ? (
                <Input
                  {...register(field as keyof RegisterEstablishmentFormData, {
                    required: 'Este campo é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Digite um e-mail válido',
                    },
                  })}
                  type='email'
                  id={field}
                  disabled={steps[0].fields.includes('password')}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                    ${errors[field as keyof RegisterEstablishmentFormData] ? 'border-red-500' : 'border-gray-300'}
                    ${steps[0].fields.includes('password') ? 'bg-gray-100 cursor-not-allowed' : ''}
                  `}
                />
              ) : field === 'password' ? (
                <Input
                  {...register(field as keyof RegisterEstablishmentFormData, {
                    required: 'Este campo é obrigatório',
                    minLength: {
                      value: 6,
                      message: 'A senha deve ter no mínimo 6 caracteres',
                    },
                  })}
                  type='password'
                  id={field}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                    ${errors[field as keyof RegisterEstablishmentFormData] ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
              ) : field === 'confirmSenha' ? (
                <Input
                  {...register(field as keyof RegisterEstablishmentFormData, {
                    required: 'Este campo é obrigatório',
                    validate: (value) =>
                      value === watch('password') || 'As senhas não coincidem',
                  })}
                  type='password'
                  id={field}
                  className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                    ${errors[field as keyof RegisterEstablishmentFormData] ? 'border-red-500' : 'border-gray-300'}
                  `}
                />
              ) : field === 'numCnpj' ? (
                <MaskedInput
                  maskType='numCnpj'
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
                  value={watch('numCnpj') || ''}
                />
              ) : field === 'numCelular' ? (
                <MaskedInput
                  maskType='numCelular'
                  {...register(field as keyof RegisterEstablishmentFormData, {
                    required: 'Este campo é obrigatório',
                    validate: (value) => {
                      const numbers = value?.replace(/\D/g, '') || '';
                      return (
                        numbers.length === 10 ||
                        numbers.length === 11 ||
                        'Número de celular inválido'
                      );
                    },
                  })}
                  error={!!errors[field as keyof RegisterEstablishmentFormData]}
                  value={watch('numCelular') || ''}
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

      <div className='flex flex-col gap-[12px] sticky bottom-0 pt-4'>
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

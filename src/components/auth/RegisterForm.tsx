import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useFormSteps } from '@/hooks/useFormSteps';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { MaskedInput } from '@/components/ui/masked-input';
import { useToast } from '@/components/ui/use-toast';
import { validateCPF, validateCNPJ } from '@/utils/validators';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { cepService } from '@/services/cep.service';
import { useAuthForm } from '@/hooks/useAuthForm';

export interface RegisterFormData {
  // Dados do usuário
  name: string;
  email: string;
  password: string;
  confirmSenha: string;
  accountType: 'cliente' | 'estabelecimento';

  // Dados pessoais (cliente)
  numCpf: string;
  numCelular: string;
  dataNascimento: string;

  // Dados do estabelecimento
  nomeEstab: string;
  razaoSocial: string;
  numCnpj: string;
  numCelularComercial: string;

  // Dados de endereço
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

type AccountType = 'cliente' | 'estabelecimento';

interface Step {
  id: string;
  title: string;
  fields: string[];
}

const steps: Record<AccountType, Step[]> = {
  cliente: [
    {
      id: 'usuario',
      title: 'Registro de Cliente',
      fields: ['email'],
    },
    {
      id: 'pessoal',
      title: 'Dados Pessoais',
      fields: ['name', 'numCpf', 'numCelular', 'dataNascimento'],
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
  ],
  estabelecimento: [
    {
      id: 'usuario',
      title: 'Registro de Estabelecimento',
      fields: ['email'],
    },
    {
      id: 'estabelecimento',
      title: 'Dados do Estabelecimento',
      fields: [
        'name',
        'nomeEstab',
        'razaoSocial',
        'numCnpj',
        'numCelularComercial',
      ],
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
  ],
};

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setError,
    setValue,
  } = useForm<RegisterFormData>({
    defaultValues: {
      accountType: 'cliente',
    },
  });

  const { setRegisterType, isRegisterAsEstablishment } = useAuthForm({
    login: () => Promise.resolve(),
    register: () => Promise.resolve(),
    onSuccess: () => {},
  });

  const accountType = isRegisterAsEstablishment ? 'estabelecimento' : 'cliente';

  const {
    currentStep,
    currentStepData,
    nextStep,
    previousStep,
    isFirstStep,
    isLastStep,
    totalSteps,
  } = useFormSteps(steps[accountType]);

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingDocument, setCheckingDocument] = useState(false);
  const [searchingCep, setSearchingCep] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Reseta todos os estados quando o componente é montado
    setLoading(false);
    setCheckingEmail(false);
    setCheckingDocument(false);
    setSearchingCep(false);

    // Reseta os campos do formulário
    setValue('email', '');
    setValue('password', '');
    setValue('confirmSenha', '');
    setValue('name', '');
    setValue('numCpf', '');
    setValue('numCelular', '');
    setValue('dataNascimento', '');
    setValue('nomeEstab', '');
    setValue('razaoSocial', '');
    setValue('numCnpj', '');
    setValue('numCelularComercial', '');
    setValue('endereco', '');
    setValue('numero', '');
    setValue('complemento', '');
    setValue('bairro', '');
    setValue('cidade', '');
    setValue('estado', '');
    setValue('cep', '');

    // Reseta os campos do primeiro passo
    if (steps[accountType][0].fields.includes('password')) {
      steps[accountType][0].fields = ['email'];
    }
  }, [accountType]);

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
        if (
          currentStep === 0 &&
          !steps[accountType][0].fields.includes('password')
        ) {
          try {
            setCheckingEmail(true);
            const accountInfo = await authService.checkAccountType(data.email);

            if (
              accountInfo.hasClienteAccount ||
              accountInfo.hasEstabelecimentoAccount
            ) {
              toast({
                title: 'Atenção!',
                description:
                  'Este email já está cadastrado. Por favor, faça login.',
              });
              router.push('/auth');
              return;
            }

            // Se não tem nenhuma conta, mostra campos de senha e confirmação
            if (!steps[accountType][0].fields.includes('password')) {
              steps[accountType][0].fields.push('password', 'confirmSenha');
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

        // Se estiver na segunda etapa, verifica documentos
        if (currentStep === 1) {
          try {
            setCheckingDocument(true);
            if (accountType === 'cliente') {
              const [cpfExists, phoneExists] = await Promise.all([
                authService.checkCPFExists(data.numCpf.replace(/\D/g, '')),
                authService.checkPhoneExists(
                  data.numCelular.replace(/\D/g, ''),
                ),
              ]);

              if (cpfExists) {
                setError('numCpf', {
                  type: 'manual',
                  message: 'Este CPF já está cadastrado',
                });
                return;
              }

              if (phoneExists) {
                setError('numCelular', {
                  type: 'manual',
                  message: 'Este número de celular já está cadastrado',
                });
                return;
              }
            } else {
              const [cnpjExists, phoneExists] = await Promise.all([
                authService.checkCNPJExists(data.numCnpj.replace(/\D/g, '')),
                authService.checkEstablishmentPhoneExists(
                  data.numCelularComercial.replace(/\D/g, ''),
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
                setError('numCelularComercial', {
                  type: 'manual',
                  message:
                    'Este número de celular já está cadastrado para outro estabelecimento',
                });
                return;
              }
            }
          } catch (error) {
            console.error('Erro ao verificar documentos:', error);
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
          ...data,
          email: data.email.toLowerCase(),
          numCpf: data.numCpf?.replace(/\D/g, ''),
          numCelular: data.numCelular?.replace(/\D/g, ''),
          numCnpj: data.numCnpj?.replace(/\D/g, ''),
          numCelularComercial: data.numCelularComercial?.replace(/\D/g, ''),
          cep: data.cep.replace(/\D/g, ''),
        };

        // Registra o usuário
        await authService.register(cleanedData);

        toast({
          title: 'Sucesso!',
          description:
            'Cadastro realizado com sucesso. Você será redirecionado para o login.',
        });

        // Redireciona para a página de login após 2 segundos
        setTimeout(() => {
          router.push('/login');
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
      name: 'Nome Completo',
      email: 'E-mail',
      password: 'Senha',
      confirmSenha: 'Confirmar Senha',
      numCpf: 'CPF',
      numCelular: 'Número de Celular',
      numCelularComercial: 'Número de Celular Comercial',
      dataNascimento: 'Data de Nascimento',
      nomeEstab: 'Nome Fantasia',
      razaoSocial: 'Razão Social',
      numCnpj: 'CNPJ',
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
    if (field === 'numCelular' || field === 'numCelularComercial') return 'tel';
    if (field === 'dataNascimento') return 'date';
    return 'text';
  };

  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 gap-4 mb-6'>
        <Button
          type='button'
          variant={accountType === 'cliente' ? 'default' : 'outline'}
          onClick={() => setRegisterType('cliente')}
          className='flex-1'
        >
          Cliente
        </Button>
        <Button
          type='button'
          variant={accountType === 'estabelecimento' ? 'default' : 'outline'}
          onClick={() => setRegisterType('estabelecimento')}
          className='flex-1'
        >
          Estabelecimento
        </Button>
      </div>

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
                {field === 'email' ? (
                  <Input
                    {...register(field as keyof RegisterFormData, {
                      required: 'Este campo é obrigatório',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Digite um e-mail válido',
                      },
                    })}
                    type='email'
                    id={field}
                    disabled={steps[accountType][0].fields.includes('password')}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                      ${errors[field as keyof RegisterFormData] ? 'border-red-500' : 'border-gray-300'}
                      ${steps[accountType][0].fields.includes('password') ? 'bg-gray-100 cursor-not-allowed' : ''}
                    `}
                  />
                ) : field === 'password' ? (
                  <Input
                    {...register(field as keyof RegisterFormData, {
                      required: 'Este campo é obrigatório',
                      minLength: {
                        value: 6,
                        message: 'A senha deve ter no mínimo 6 caracteres',
                      },
                    })}
                    type='password'
                    id={field}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                      ${errors[field as keyof RegisterFormData] ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                ) : field === 'confirmSenha' ? (
                  <Input
                    {...register(field as keyof RegisterFormData, {
                      required: 'Este campo é obrigatório',
                      validate: (value) =>
                        value === watch('password') ||
                        'As senhas não coincidem',
                    })}
                    type='password'
                    id={field}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                      ${errors[field as keyof RegisterFormData] ? 'border-red-500' : 'border-gray-300'}
                    `}
                  />
                ) : field === 'numCpf' ? (
                  <MaskedInput
                    maskType='numCpf'
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
                ) : field === 'numCnpj' ? (
                  <MaskedInput
                    maskType='numCnpj'
                    {...register(field as keyof RegisterFormData, {
                      required: 'Este campo é obrigatório',
                      validate: (value) => {
                        const numbers = value?.replace(/\D/g, '') || '';
                        if (numbers.length !== 14) return 'CNPJ inválido';
                        return validateCNPJ(numbers) || 'CNPJ inválido';
                      },
                    })}
                    error={!!errors[field as keyof RegisterFormData]}
                    value={watch(field as keyof RegisterFormData) || ''}
                  />
                ) : field === 'numCelular' ||
                  field === 'numCelularComercial' ? (
                  <MaskedInput
                    maskType='numCelular'
                    {...register(field as keyof RegisterFormData, {
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
    </div>
  );
};

export default RegisterForm;

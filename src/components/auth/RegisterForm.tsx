import React, { useState, useEffect } from 'react';
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
import { useRouter } from 'next/navigation';
import { cepService } from '@/services/cep.service';
import { useAuthFormContext } from '@/contexts/AuthFormContext';
import { register_steps } from '@/data/register_steps';
import { RegisterFormData } from '@/interfaces/register';
import { getFieldLabel, getFieldType } from '@/utils/registerFieldsFuncs';

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

  const { setRegisterType, isRegisterAsEstablishment, toggleForm } =
    useAuthFormContext();

  useEffect(() => {
    console.log(
      'isRegisterAsEstablishment mudou para:',
      isRegisterAsEstablishment,
    );
  }, [isRegisterAsEstablishment]);

  const accountType = isRegisterAsEstablishment ? 'estabelecimento' : 'cliente';

  const {
    currentStep,
    currentStepData,
    nextStep,
    previousStep,
    isFirstStep,
    isLastStep,
    totalSteps,
  } = useFormSteps(register_steps[accountType]);

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
    if (register_steps[accountType][0].fields.includes('password')) {
      register_steps[accountType][0].fields = ['email'];
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
      // Primeiro passo - Verificação de email
      if (currentStep === 0) {
        try {
          setCheckingEmail(true);
          const accountInfo = await authService.checkAccountType(data.email);

          if (accountInfo.hasClienteAccount) {
            toast({
              title: 'Atenção!',
              description:
                'Este email já está cadastrado como cliente. Por favor, faça login.',
            });
            router.push('/login');
            return;
          }

          // Se chegou aqui, o email está disponível
          nextStep();
        } catch (error) {
          console.error('Erro ao verificar email:', error);
          toast({
            title: 'Erro!',
            description: 'Não foi possível verificar o email. Tente novamente.',
            variant: 'destructive',
          });
        } finally {
          setCheckingEmail(false);
        }
        return;
      }

      // Para os outros passos, valida os campos antes de prosseguir
      const isValid = await trigger(
        currentStepData.fields as Array<keyof RegisterFormData>,
      );

      if (isValid) {
        // Segundo passo - Validação de senha
        if (currentStep === 1) {
          const password = data.password;
          const confirmPassword = data.confirmSenha;

          if (password !== confirmPassword) {
            setError('confirmSenha', {
              type: 'manual',
              message: 'As senhas não coincidem',
            });
            return;
          }

          // Validar força da senha
          const hasUpperCase = /[A-Z]/.test(password);
          const hasLowerCase = /[a-z]/.test(password);
          const hasNumbers = /\d/.test(password);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
          const isLongEnough = password.length >= 8;

          let passwordStrength = 0;
          if (hasUpperCase) passwordStrength++;
          if (hasLowerCase) passwordStrength++;
          if (hasNumbers) passwordStrength++;
          if (hasSpecialChar) passwordStrength++;
          if (isLongEnough) passwordStrength++;

          if (passwordStrength < 3) {
            setError('password', {
              type: 'manual',
              message:
                'A senha deve ser mais forte. Inclua letras maiúsculas, minúsculas, números e caracteres especiais.',
            });
            return;
          }

          nextStep();
          return;
        }

        // Terceiro passo - Validação de CPF e Celular
        if (currentStep === 2) {
          try {
            setCheckingDocument(true);
            const [cpfExists, phoneExists] = await Promise.all([
              authService.checkCPFExists(data.numCpf.replace(/\D/g, '')),
              authService.checkPhoneExists(data.numCelular.replace(/\D/g, '')),
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

            nextStep();
          } catch (error) {
            console.error('Erro ao verificar documentos:', error);
            toast({
              title: 'Erro!',
              description:
                'Não foi possível verificar os dados. Tente novamente.',
              variant: 'destructive',
            });
          } finally {
            setCheckingDocument(false);
          }
          return;
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

  // Componente para mostrar a força da senha
  const PasswordStrengthIndicator = ({ password }: { password: string }) => {
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    let strength = 0;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChar) strength++;
    if (isLongEnough) strength++;

    const getStrengthText = () => {
      if (strength <= 2) return 'Fraca';
      if (strength <= 3) return 'Média';
      if (strength <= 4) return 'Forte';
      return 'Muito forte';
    };

    const getStrengthColor = () => {
      if (strength <= 2) return 'bg-red-500';
      if (strength <= 3) return 'bg-yellow-500';
      if (strength <= 4) return 'bg-green-500';
      return 'bg-green-700';
    };

    return (
      <div className='mt-2'>
        <div className='h-1 w-full bg-gray-200 rounded-full'>
          <div
            className={`h-1 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <p className='text-xs mt-1 text-gray-600'>
          Força da senha: {getStrengthText()}
        </p>
      </div>
    );
  };

  return (
    <div className='space-y-4'>
      {currentStep === 0 && (
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
      )}

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
                    disabled={checkingEmail}
                    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                      ${errors[field as keyof RegisterFormData] ? 'border-red-500' : 'border-gray-300'}
                      ${checkingEmail ? 'bg-gray-100 cursor-not-allowed' : ''}
                    `}
                  />
                ) : field === 'password' ? (
                  <div>
                    <Input
                      {...register(field as keyof RegisterFormData, {
                        required: 'Este campo é obrigatório',
                        minLength: {
                          value: 8,
                          message: 'A senha deve ter no mínimo 8 caracteres',
                        },
                      })}
                      type='password'
                      id={field}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                        ${errors[field as keyof RegisterFormData] ? 'border-red-500' : 'border-gray-300'}
                      `}
                    />
                    <PasswordStrengthIndicator password={watch('password')} />
                  </div>
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
                    onBlur={async (e) => {
                      const cpf = e.target.value.replace(/\D/g, '');
                      if (cpf.length === 11 && validateCPF(cpf)) {
                        try {
                          const exists = await authService.checkCPFExists(cpf);
                          if (exists) {
                            setError('numCpf', {
                              type: 'manual',
                              message: 'Este CPF já está cadastrado',
                            });
                          }
                        } catch (error) {
                          console.error('Erro ao verificar CPF:', error);
                        }
                      }
                    }}
                  />
                ) : field === 'numCelular' ? (
                  <MaskedInput
                    maskType='numCelular'
                    {...register(field as keyof RegisterFormData, {
                      required: 'Este campo é obrigatório',
                      validate: (value) => {
                        const numbers = value?.replace(/\D/g, '') || '';
                        return (
                          numbers.length === 11 || 'Número de celular inválido'
                        );
                      },
                    })}
                    error={!!errors[field as keyof RegisterFormData]}
                    value={watch(field as keyof RegisterFormData) || ''}
                    onBlur={async (e) => {
                      const phone = e.target.value.replace(/\D/g, '');
                      if (phone.length === 11) {
                        try {
                          const exists =
                            await authService.checkPhoneExists(phone);
                          if (exists) {
                            setError('numCelular', {
                              type: 'manual',
                              message:
                                'Este número de celular já está cadastrado',
                            });
                          }
                        } catch (error) {
                          console.error('Erro ao verificar celular:', error);
                        }
                      }
                    }}
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
                ? 'Verificando email...'
                : checkingDocument
                  ? 'Verificando documentos...'
                  : isLastStep
                    ? 'Registrar'
                    : 'Próximo'}
          </Button>

          <div className='mt-[12px] text-end flex flex-col gap-[12px]'>
            <p className='text-[#272727] text-[12px] leading-[120%] font-[500]'>
              Já tem uma conta?{' '}
              <span
                className='underline cursor-pointer font-[700]'
                onClick={toggleForm}
              >
                Faça Login
              </span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;

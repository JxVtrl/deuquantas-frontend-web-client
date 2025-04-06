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
import { useRouter } from 'next/navigation';
import { useAuthFormContext } from '@/contexts/AuthFormContext';
import { register_steps } from '@/data/register_steps';
import { RegisterFormData } from '@/interfaces/register';
import { getFieldLabel, getFieldType } from '@/utils/registerFieldsFuncs';
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator';
import { RegisterService } from '@/services/register.service';
import { DocumentService } from '@/services/document.service';
import { EmailService } from '@/services/email.service';
import { PasswordService } from '@/services/password.service';
import { AddressService } from '@/services/address.service';

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
  const [searchingCep, setSearchingCep] = useState(false);
  const [isStepValid, setIsStepValid] = useState(false);
  const router = useRouter();
  const [emailMessage, setEmailMessage] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [emailValidated, setEmailValidated] = useState(false);

  useEffect(() => {
    // Reseta todos os estados quando o componente é montado
    setLoading(false);
    setCheckingEmail(false);
    setSearchingCep(false);

    // Reseta os campos do formulário
    setValue('email', '');
    setValue('password', '');
    setValue('confirmSenha', '');
    setValue('name', '');
    setValue('num_cpf', '');
    setValue('num_celular', '');
    setValue('data_nascimento', '');
    setValue('nome_estab', '');
    setValue('razao_social', '');
    setValue('num_cnpj', '');
    setValue('num_celular', '');
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

  // Efeito para validar os campos do step atual sempre que houver mudança nos valores
  useEffect(() => {
    const validateCurrentStep = async () => {
      if (currentStep === 0) {
        // No primeiro passo, só permitir avançar se o email foi validado e não existe
        setIsStepValid(emailValidated && !emailExists);
      } else {
        const isValid = await RegisterService.handleStepValidation(
          currentStep,
          watch(),
          isRegisterAsEstablishment,
        );
        setIsStepValid(isValid);
      }
    };

    validateCurrentStep();
  }, [
    currentStep,
    watch(),
    currentStepData.fields,
    isRegisterAsEstablishment,
    emailValidated,
    emailExists,
  ]);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    await AddressService.handleCepChange(cep, setValue, (message) => {
      toast({
        title: 'Erro!',
        description: message,
        variant: 'destructive',
      });
    });
  };

  const handleEmailBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const email = e.target.value;
    if (email) {
      setCheckingEmail(true);
      try {
        const result = await EmailService.checkEmail(
          email.toLowerCase(),
          (message) => {
            toast({
              title: 'Erro!',
              description: message,
              variant: 'destructive',
            });
          },
        );
        setEmailMessage(result.message);
        setEmailExists(result.exists);
        setEmailValidated(true);
      } finally {
        setCheckingEmail(false);
      }
    }
  };

  const handleCPFBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cpf = e.target.value.replace(/\D/g, '');
    if (cpf.length === 11) {
      if (!DocumentService.validateCPF(cpf)) {
        setError('num_cpf', {
          type: 'manual',
          message: 'CPF inválido',
        });
        return;
      }
      try {
        const cpfExists = await DocumentService.checkCPFExists(cpf);
        if (cpfExists.exists) {
          setError('num_cpf', {
            type: 'manual',
            message: cpfExists.message,
          });
        }
      } catch (error) {
        console.error('Erro ao verificar CPF:', error);
      }
    }
  };

  const handleCNPJBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cnpj = e.target.value.replace(/\D/g, '');
    if (cnpj.length === 14) {
      if (!DocumentService.validateCNPJ(cnpj)) {
        setError('num_cnpj', {
          type: 'manual',
          message: 'CNPJ inválido',
        });
        return;
      }
      try {
        const result = await DocumentService.checkCNPJExists(
          cnpj,
          (message) => {
            toast({
              title: 'Erro!',
              description: message,
              variant: 'destructive',
            });
          },
        );
        if (result.exists) {
          setError('num_cnpj', {
            type: 'manual',
            message: result.message,
          });
        }
      } catch (error) {
        console.error('Erro ao verificar CNPJ:', error);
      }
    }
  };

  const handlePhoneBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const phone = e.target.value.replace(/\D/g, '');
    if (phone.length === 11) {
      if (!DocumentService.validatePhone(phone)) {
        setError('num_celular', {
          type: 'manual',
          message: 'Número de celular inválido',
        });
        return;
      }
      try {
        const result = await DocumentService.checkPhoneExists(phone);
        if (result.exists) {
          setError('num_celular', {
            type: 'manual',
            message: result.message,
          });
        }
      } catch (error) {
        console.error('Erro ao verificar telefone:', error);
      }
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!isLastStep) {
      // Primeiro passo - Verificação de email
      if (currentStep === 0) {
        setCheckingEmail(true);
        try {
          const result = await EmailService.checkEmail(
            data.email.toLowerCase(),
            (message) => {
              toast({
                title: 'Erro!',
                description: message,
                variant: 'destructive',
              });
            },
          );

          if (result.exists) {
            router.push('/login');
            return;
          }

          if (!result.exists) {
            nextStep();
          }
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
          const { isValid: passwordValid, strength } =
            PasswordService.validatePassword(data.password, data.confirmSenha);

          if (!passwordValid) {
            setError('password', {
              type: 'manual',
              message: PasswordService.getPasswordStrengthMessage(strength),
            });
            return;
          }

          nextStep();
          return;
        }

        // Terceiro passo - Validação de documentos
        if (currentStep === 2) {
          const isValid = await trigger(
            currentStepData.fields as Array<keyof RegisterFormData>,
          );
          if (isValid) {
            nextStep();
          }
          return;
        }

        // Quarto passo - Validação de endereço
        if (currentStep === 3) {
          const addressValid = AddressService.validateAddress({
            cep: data.cep,
            endereco: data.endereco,
            numero: data.numero,
            bairro: data.bairro,
            cidade: data.cidade,
            estado: data.estado,
          });

          if (addressValid) {
            nextStep();
          }
          return;
        }

        nextStep();
      }
    } else {
      try {
        setLoading(true);
        await RegisterService.handleRegistration(
          data,
          isRegisterAsEstablishment,
          (message) => {
            toast({
              title: 'Sucesso!',
              description: message,
            });
          },
          (message) => {
            toast({
              title: 'Erro!',
              description: message,
              variant: 'destructive',
            });
          },
        );
      } catch (error) {
        console.error('Erro no processo de registro:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Componente para mostrar a força da senha

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
                  <div>
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
                      onBlur={handleEmailBlur}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase();
                        e.target.value = value;
                        register('email').onChange(e);
                      }}
                      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background
                        ${errors[field as keyof RegisterFormData] ? 'border-red-500' : 'border-gray-300'}
                        ${checkingEmail ? 'bg-gray-100 cursor-not-allowed' : ''}
                      `}
                    />
                    {emailExists && (
                      <p className='text-red-500 text-sm mt-1'>
                        {emailMessage}
                      </p>
                    )}
                  </div>
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
                ) : field === 'num_cpf' ? (
                  <MaskedInput
                    maskType='num_cpf'
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
                    onBlur={handleCPFBlur}
                  />
                ) : field === 'num_celular' ? (
                  <MaskedInput
                    maskType='num_celular'
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
                    onBlur={handlePhoneBlur}
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
                      const value = e.target.value.replace(/\D/g, '');
                      e.target.value = value;
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
                ) : field === 'num_cnpj' ? (
                  <MaskedInput
                    maskType='num_cnpj'
                    {...register(field as keyof RegisterFormData, {
                      required: 'Este campo é obrigatório',
                      validate: (value) => {
                        const numbers = value?.replace(/\D/g, '') || '';
                        if (numbers.length !== 14) return 'CNPJ inválido';
                        return true;
                      },
                    })}
                    error={!!errors[field as keyof RegisterFormData]}
                    value={watch(field as keyof RegisterFormData) || ''}
                    onBlur={handleCNPJBlur}
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
          <Button
            type='submit'
            className='w-full'
            disabled={!isStepValid || loading || checkingEmail}
          >
            {loading || checkingEmail ? (
              <div className='flex items-center justify-center'>
                <div className='w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2'></div>
                {checkingEmail ? 'Verificando...' : 'Carregando...'}
              </div>
            ) : isLastStep ? (
              'Finalizar'
            ) : (
              'Próximo'
            )}
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

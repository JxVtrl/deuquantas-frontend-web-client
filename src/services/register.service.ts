import { AuthService } from './auth.service';
import { RegisterFormData } from '@/interfaces/register';
import { validateCPF } from '@/utils/validators';
import {
  RegisterData,
  RegisterEstablishmentData,
} from '@/services/auth.service';
import { ErrorService } from './error.service';

export class RegisterService {
  static async handleStepValidation(
    currentStep: number,
    data: RegisterFormData,
    isRegisterAsEstablishment: boolean,
  ): Promise<boolean> {
    switch (currentStep) {
      case 0:
        return this.validateEmailStep(data.email);
      case 1:
        return this.validatePasswordStep(data.password, data.confirmSenha);
      case 2:
        return isRegisterAsEstablishment
          ? this.validateEstablishmentStep(data)
          : this.validateClientStep(data);
      case 3:
        return this.validateAddressStep(data);
      default:
        return true;
    }
  }

  private static validateEmailStep(email: string): boolean {
    return !!(email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email));
  }

  private static validatePasswordStep(
    password: string,
    confirmPassword: string,
  ): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password?.length >= 8;

    let passwordStrength = 0;
    if (hasUpperCase) passwordStrength++;
    if (hasLowerCase) passwordStrength++;
    if (hasNumbers) passwordStrength++;
    if (hasSpecialChar) passwordStrength++;
    if (isLongEnough) passwordStrength++;

    return !!(
      password &&
      confirmPassword &&
      password === confirmPassword &&
      passwordStrength >= 3
    );
  }

  private static validateEstablishmentStep(data: RegisterFormData): boolean {
    const { num_cnpj, num_celular, nome_estab, razao_social } = data;
    return !!(
      num_cnpj?.replace(/\D/g, '').length === 14 &&
      num_celular?.replace(/\D/g, '').length === 11 &&
      nome_estab &&
      razao_social
    );
  }

  private static validateClientStep(data: RegisterFormData): boolean {
    const { name, num_cpf, num_celular, data_nascimento } = data;
    return !!(
      name &&
      num_cpf?.replace(/\D/g, '').length === 11 &&
      validateCPF(num_cpf?.replace(/\D/g, '')) &&
      num_celular?.replace(/\D/g, '').length === 11 &&
      data_nascimento
    );
  }

  private static validateAddressStep(data: RegisterFormData): boolean {
    const { cep, endereco, numero, bairro, cidade, estado } = data;
    return !!(
      cep?.replace(/\D/g, '').length === 8 &&
      endereco &&
      numero &&
      bairro &&
      cidade &&
      estado
    );
  }

  static async handleRegistration(
    data: RegisterFormData,
    isRegisterAsEstablishment: boolean,
    showSuccess: (message: string) => void,
    showError: (message: string) => void,
  ): Promise<void> {
    try {
      // Remove máscaras antes de enviar
      const cleanedData = {
        ...data,
        email: data.email.toLowerCase(),
        num_cpf: data.num_cpf?.replace(/\D/g, ''),
        num_celular: data.num_celular?.replace(/\D/g, ''),
        num_cnpj: data.num_cnpj?.replace(/\D/g, ''),
        cep: data.cep.replace(/\D/g, ''),
      };

      // Filtra os campos baseado no tipo de conta
      const dataToSend = isRegisterAsEstablishment
        ? ({
            email: cleanedData.email,
            password: cleanedData.password,
            name: cleanedData.nome_estab,
            num_cnpj: cleanedData.num_cnpj || '',
            num_celular: cleanedData.num_celular || '',
            nome_estab: cleanedData.nome_estab || '',
            razao_social: cleanedData.razao_social || '',
            endereco: cleanedData.endereco,
            numero: cleanedData.numero,
            complemento: cleanedData.complemento,
            bairro: cleanedData.bairro,
            cidade: cleanedData.cidade,
            estado: cleanedData.estado,
            cep: cleanedData.cep,
          } as RegisterEstablishmentData)
        : ({
            email: cleanedData.email,
            password: cleanedData.password,
            name: cleanedData.name,
            num_cpf: cleanedData.num_cpf || '',
            num_celular: cleanedData.num_celular || '',
            data_nascimento: cleanedData.data_nascimento,
            endereco: cleanedData.endereco,
            numero: cleanedData.numero,
            complemento: cleanedData.complemento,
            bairro: cleanedData.bairro,
            cidade: cleanedData.cidade,
            estado: cleanedData.estado,
            cep: cleanedData.cep,
          } as RegisterData);

      if (isRegisterAsEstablishment) {
        await AuthService.registerEstablishment(
          dataToSend as RegisterEstablishmentData,
        );
      } else {
        await AuthService.register(dataToSend as RegisterData);
      }

      showSuccess('Cadastro realizado com sucesso. Bem-vindo!');
      window.location.href = isRegisterAsEstablishment
        ? '/establishment/home'
        : '/customer/home';
    } catch (error) {
      console.error('Erro no processo de registro:', error);
      const errorMessage = ErrorService.handleError(
        error,
        'Ocorreu um erro ao realizar o cadastro.',
      );
      showError(errorMessage);
      throw error;
    }
  }
}

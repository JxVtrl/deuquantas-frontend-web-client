import { api } from '@/lib/axios';

export class DocumentService {
  static validateCPF(cpf: string): boolean {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(9))) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(10))) return false;

    return true;
  }

  static validateCNPJ(cnpj: string): boolean {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;

    // Validação do primeiro dígito verificador
    let tamanho = cnpjLimpo.length - 2;
    const numeros = cnpjLimpo.substring(0, tamanho);
    const digitos = cnpjLimpo.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    // Validação do segundo dígito verificador
    tamanho = tamanho + 1;
    const numeros2 = cnpjLimpo.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros2.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
  }

  static validatePhone(phone: string): boolean {
    const phoneLimpo = phone.replace(/\D/g, '');
    return phoneLimpo.length === 11 && /^[1-9]{2}9[0-9]{8}$/.test(phoneLimpo);
  }

  static async checkCPFExists(
    cpf: string,
  ): Promise<{ exists: boolean; message: string }> {
    try {
      const response = await api.get(`/auth/check-cpf/${cpf}`);
      return {
        exists: response.data.exists,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Erro ao verificar CPF:', error);
      return {
        exists: false,
        message: 'Erro ao verificar CPF',
      };
    }
  }

  static async checkPhoneExists(
    phone: string,
  ): Promise<{ exists: boolean; message: string }> {
    try {
      const response = await api.get(`/auth/check-phone/${phone}`);
      return {
        exists: response.data.exists,
        message: response.data.message,
      };
    } catch (error) {
      console.error('Erro ao verificar telefone:', error);
      return {
        exists: false,
        message: 'Erro ao verificar telefone',
      };
    }
  }
}

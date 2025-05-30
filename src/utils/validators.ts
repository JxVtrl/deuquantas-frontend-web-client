import { RegisterFormData } from '@/interfaces/register';

export function validateCPF(num_cpf: string): boolean {
  // Remove caracteres não numéricos
  const numbers = num_cpf.replace(/\D/g, '');

  // Verifica se tem 11 dígitos
  if (numbers.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(numbers.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(numbers.charAt(10))) return false;

  return true;
}

export function validateCNPJ(num_cnpj: string): boolean {
  // Remove caracteres não numéricos
  num_cnpj = num_cnpj.replace(/\D/g, '');

  // Verifica se tem 14 dígitos
  if (num_cnpj.length !== 14) return false;

  // Elimina CNPJs inválidos conhecidos
  if (/^(\d)\1+$/.test(num_cnpj)) return false;

  // Validação do primeiro dígito verificador
  let soma = 0;
  let peso = 5;
  for (let i = 0; i < 12; i++) {
    soma += parseInt(num_cnpj.charAt(i)) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  let digito = 11 - (soma % 11);
  if (digito > 9) digito = 0;
  if (parseInt(num_cnpj.charAt(12)) !== digito) return false;

  // Validação do segundo dígito verificador
  soma = 0;
  peso = 6;
  for (let i = 0; i < 13; i++) {
    soma += parseInt(num_cnpj.charAt(i)) * peso;
    peso = peso === 2 ? 9 : peso - 1;
  }
  digito = 11 - (soma % 11);
  if (digito > 9) digito = 0;
  if (parseInt(num_cnpj.charAt(13)) !== digito) return false;

  return true;
}

export const validateEmail = (email: string): boolean => {
  return !!(email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email));
};

export const validatePassword = (
  password: string,
): { isValid: boolean; strength: number } => {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password?.length >= 8;

  let strength = 0;
  if (hasUpperCase) strength++;
  if (hasLowerCase) strength++;
  if (hasNumbers) strength++;
  if (hasSpecialChar) strength++;
  if (isLongEnough) strength++;

  return {
    isValid: !!(password && strength >= 3),
    strength,
  };
};

export const validateEstablishmentData = (data: RegisterFormData): boolean => {
  const { num_cnpj, num_celular, nome_estab, razao_social } = data;
  return !!(num_cnpj && num_celular && nome_estab && razao_social);
};

export const validateClientData = (
  data: {
    name: string;
    num_cpf: string;
    num_celular: string;
    data_nascimento: string;
  },
  validateCPF: (cpf: string) => boolean,
): boolean => {
  const { name, num_cpf, num_celular, data_nascimento } = data;
  return !!(
    name &&
    num_cpf?.replace(/\D/g, '').length === 11 &&
    validateCPF(num_cpf?.replace(/\D/g, '')) &&
    num_celular?.replace(/\D/g, '').length === 11 &&
    data_nascimento
  );
};

export const validateAddressData = (data: {
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}): boolean => {
  const { cep, endereco, numero, bairro, cidade, estado } = data;
  return !!(
    cep?.replace(/\D/g, '').length === 8 &&
    endereco &&
    numero &&
    bairro &&
    cidade &&
    estado
  );
};

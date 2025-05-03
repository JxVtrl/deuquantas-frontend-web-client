export const masks = {
  num_cpf: '999.999.999-99',
  num_cnpj: '99.999.999/9999-99',
  num_celular: '(99) 99999-9999',
  cep: '99999-999',
  cartao: '9999 9999 9999 9999',
  validade: '99/99',
  cvv: '9999',
} as const;

export type MaskType = keyof typeof masks;

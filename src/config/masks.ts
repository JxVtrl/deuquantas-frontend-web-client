export const masks = {
  num_cpf: '999.999.999-99',
  num_cnpj: '99.999.999/9999-99',
  num_celular: '(99) 99999-9999',
  cep: '99999-999',
} as const;

export type MaskType = keyof typeof masks;

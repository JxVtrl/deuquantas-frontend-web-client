export const masks = {
  cpf: '999.999.999-99',
  cnpj: '99.999.999/9999-99',
  telefone: '(99) 99999-9999',
  cep: '99999-999',
} as const;

export type MaskType = keyof typeof masks;

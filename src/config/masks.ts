export const masks = {
  numCpf: '999.999.999-99',
  numCnpj: '99.999.999/9999-99',
  numCelular: '(99) 99999-9999',
  cep: '99999-999',
} as const;

export type MaskType = keyof typeof masks;

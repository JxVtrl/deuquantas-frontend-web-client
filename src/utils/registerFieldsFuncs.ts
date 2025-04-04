export const getFieldLabel = (field: string) => {
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

export const getFieldType = (field: string) => {
  if (field === 'email') return 'email';
  if (field === 'password' || field === 'confirmSenha') return 'password';
  if (field === 'numCelular' || field === 'numCelularComercial') return 'tel';
  if (field === 'dataNascimento') return 'date';
  return 'text';
};

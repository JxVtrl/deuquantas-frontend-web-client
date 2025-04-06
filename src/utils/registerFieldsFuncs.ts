export const getFieldLabel = (field: string) => {
  const labels: Record<string, string> = {
    name: 'Nome Completo',
    email: 'E-mail',
    password: 'Senha',
    confirmSenha: 'Confirmar Senha',
    num_cpf: 'CPF',
    num_celular: 'Número de Celular',
    data_nascimento: 'Data de Nascimento',
    nome_estab: 'Nome Fantasia',
    razao_social: 'Razão Social',
    num_cnpj: 'CNPJ',
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
  if (field === 'num_celular') return 'tel';
  if (field === 'data_nascimento') return 'date';
  return 'text';
};

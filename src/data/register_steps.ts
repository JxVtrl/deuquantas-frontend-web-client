type AccountType = 'cliente' | 'estabelecimento';

interface Step {
  id: string;
  title: string;
  fields: string[];
}

export const register_steps: Record<AccountType, Step[]> = {
  cliente: [
    {
      id: 'email',
      title: 'Qual é o seu e-mail?',
      fields: ['email'],
    },
    {
      id: 'senha',
      title: 'Crie sua senha',
      fields: ['password', 'confirmSenha'],
    },
    {
      id: 'pessoal',
      title: 'Dados Pessoais',
      fields: ['name', 'num_cpf', 'num_celular', 'data_nascimento'],
    },
    {
      id: 'endereco',
      title: 'Onde você mora?',
      fields: [
        'cep',
        'endereco',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'estado',
      ],
    },
  ],
  estabelecimento: [
    {
      id: 'usuario',
      title: 'Registro de Estabelecimento',
      fields: ['email'],
    },
    {
      id: 'senha',
      title: 'Crie sua senha',
      fields: ['password', 'confirmSenha'],
    },
    {
      id: 'estabelecimento',
      title: 'Dados do Estabelecimento',
      fields: ['nome_estab', 'razao_social', 'num_cnpj', 'num_celular'],
    },
    {
      id: 'endereco',
      title: 'Dados do Endereço',
      fields: [
        'cep',
        'endereco',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'estado',
      ],
    },
  ],
};

export const registerSteps = [
  {
    id: 'account-type',
    title: 'Tipo de Conta',
    fields: ['accountType'],
  },
  {
    id: 'user',
    title: 'Dados do Usuário',
    fields: ['email', 'password', 'confirmPassword'],
  },
  {
    id: 'establishment',
    title: 'Dados do Estabelecimento',
    fields: ['nome_estab', 'razao_social', 'num_cnpj', 'num_celular'],
  },
  {
    id: 'address',
    title: 'Endereço',
    fields: [
      'endereco',
      'numero',
      'complemento',
      'bairro',
      'cidade',
      'estado',
      'cep',
    ],
  },
  {
    id: 'logo',
    title: 'Logo',
    fields: ['imgLogo'],
  },
];

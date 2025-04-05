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
      fields: ['name', 'numCpf', 'numCelular', 'dataNascimento'],
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
      fields: ['nomeEstab', 'razaoSocial', 'numCnpj', 'numCelular'],
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
    fields: ['name', 'email', 'password', 'confirmPassword'],
  },
  {
    id: 'establishment',
    title: 'Dados do Estabelecimento',
    fields: ['nomeEstab', 'razaoSocial', 'numCnpj', 'numCelular'],
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

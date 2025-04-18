interface Step {
  id: string;
  title: string;
  fields: string[];
}

export const register_steps: Step[] = [
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
];


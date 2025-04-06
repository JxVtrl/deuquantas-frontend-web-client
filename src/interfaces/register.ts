export interface RegisterFormData {
  // Dados do usuário
  name: string;
  email: string;
  password: string;
  confirmSenha: string;
  accountType: 'cliente' | 'estabelecimento';

  // Dados pessoais (cliente)
  num_cpf: string;
  num_celular: string;
  data_nascimento: string;

  // Dados do estabelecimento
  nome_estab: string;
  razao_social: string;
  num_cnpj: string;

  // Dados de endereço
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

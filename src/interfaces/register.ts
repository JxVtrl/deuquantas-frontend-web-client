export interface RegisterFormData {
  // Dados do usuário
  name: string;
  email: string;
  password: string;
  confirmSenha: string;
  accountType: 'cliente' | 'estabelecimento';

  // Dados pessoais (cliente)
  numCpf: string;
  numCelular: string;
  dataNascimento: string;

  // Dados do estabelecimento
  nomeEstab: string;
  razaoSocial: string;
  numCnpj: string;

  // Dados de endereço
  endereco: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

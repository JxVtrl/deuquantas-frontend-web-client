export interface Estabelecimento {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

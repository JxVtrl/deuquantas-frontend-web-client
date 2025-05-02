import { api } from '@/lib/axios';

export interface Item {
  data_atualizacao: string;
  data_criacao: string;
  descricao: string;
  disponivel: boolean;
  estabelecimento_id: string;
  id: string;
  img: string;
  nome: string;
  preco: number;
  tipo: string;
  quantidade?: number;
  observacao?: string;
}

export interface Pedido {
  cliente: {
    avatar: string;
    bairro: string;
    cep: string;
    cidade: string;
    complemento: string;
    createdAt: string;
    data_nascimento: string;
    endereco: string;
    estado: string;
    id: string;
    is_ativo: boolean;
    num_celular: string;
    num_cpf: string;
    numero: string;
    updatedAt: string;
    usuario: {
      data_atualizacao: string;
      data_criacao: string;
      email: string;
      id: string;
      is_admin: boolean;
      is_ativo: boolean;
      name: string;
    };
  };
  data_criacao: string;
  id: string;
  id_cliente: string;
  id_comanda: string;
  id_item: string;
  item: {
    data_atualizacao: string;
    data_criacao: string;
    descricao: string;
    disponivel: boolean;
    estabelecimento_id: string;
    id: string;
    img: string;
    nome: string;
    preco: number;
    tipo: string;
  };
  observacao?: string;
  valor_total: number;
  valor_unitario: number;
}

export class MenuService {
  static async getItensByEstabelecimento(cnpj: string): Promise<Item[]> {
    try {
      const response = await api.get<Item[]>(`/itens/${cnpj}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar itens do estabelecimento:', error);
      throw error;
    }
  }
}

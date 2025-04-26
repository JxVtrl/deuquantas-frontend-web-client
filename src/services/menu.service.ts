import { api } from '@/lib/axios';

export interface Item {
  id: string;
  nome: string;
  tipo: string;
  preco: number;
  img?: string;
  descricao?: string;
  disponivel: boolean;
  data_criacao: Date;
  data_atualizacao: Date;
  estabelecimento_id: string;
  quantidade?: number;
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

import { api } from '@/lib/axios';

export interface Item {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
  categoria: string;
  imagem?: string;
  observacao?: string;
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

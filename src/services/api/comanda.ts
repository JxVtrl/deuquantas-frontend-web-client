import { api } from '@/lib/axios';

interface ItemCarrinho {
  id_item: string;
  quantidade: number;
  observacao?: string;
}

interface AdicionarItensRequest {
  id_comanda: string;
  itens: ItemCarrinho[];
}

export const comandaService = {
  adicionarItens: async (data: AdicionarItensRequest) => {
    const response = await api.post('/comandas/adicionar-itens', data);
    return response.data;
  },
};

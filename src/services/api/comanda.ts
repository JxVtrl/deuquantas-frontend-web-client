import { api } from '@/lib/axios';

interface ItemCarrinho {
  id_item: string;
  quantidade: number;
  observacao?: string;
}

interface AdicionarItensRequest {
  id_comanda: string;
  id_cliente: string;
  itens: ItemCarrinho[];
}

interface AdicionarPessoaRequest {
  id_comanda: string;
  id_usuario: string;
}

interface ExcluirPessoaRequest {
  id_comanda: string;
  id_usuario: string;
}

export const comandaService = {
  adicionarItens: async (data: AdicionarItensRequest) => {
    const response = await api.post('/comandas/adicionar-itens', data);
    return response.data;
  },

  adicionarPessoa: (data: AdicionarPessoaRequest) =>
    api.post('/comandas/adicionar-pessoa', data),

  excluirPessoa: (data: ExcluirPessoaRequest) =>
    api.post('/comandas/excluir-pessoa', data),
};

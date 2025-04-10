export interface CreateComandaDto {
  num_cpf: string;
  num_cnpj: string;
  numMesa: string;
  datApropriacao: string;
  horPedido: string;
  codItem: string;
  numQuant: number;
  valPreco: number;
}

export interface ComandaResponse {
  id: string;
  num_cpf: string;
  num_cnpj: string;
  numMesa: string;
  datApropriacao: string;
  horPedido: string;
  codItem: string;
  numQuant: number;
  valPreco: number;
  is_ativo: boolean;
  data_criacao: string;
  conta: {
    num_cnpj: string;
    numMesa: string;
    num_cpf: string;
    datConta: string;
    valConta: number;
    codFormaPg: number;
    horPagto?: string;
    codErro?: number;
  };
}

import { api } from '@/lib/axios';

export const ComandaService = {
  async getComandaAtivaByCpf(num_cpf: string): Promise<ComandaResponse | null> {
    try {
      const response = await api.get(`/comandas/ativa/${num_cpf}`);
      return response.data?.id ? response.data : null;
    } catch (error) {
      console.error('Erro ao buscar comanda ativa:', error);
      return null;
    }
  },
};

export default ComandaService;

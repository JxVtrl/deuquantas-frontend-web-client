export interface CreateComandaDto {
  num_cpf: string;
  num_cnpj: string;
  numMesa: string;
  data_apropriacao: string;
  status: string;
}

export interface ComandaResponse {
  conta: {
    codErro?: number;
    codFormaPg: number;
    data_criacao: string;
    data_fechamento?: string;
    horPagamento?: string;
    id: string;
    id_comanda: string;
    valDesconto?: number;
    valServico?: number;
    valTotal: number;
  };
  pessoas?: {
    id: string;
    nome: string;
    data_criacao: string;
    valor_total: number;
  }[];
  data_criacao: string;
  id: string;
  itens: Item[];
  num_cpf: string;
  num_cnpj: string;
  numMesa: string;
  status: 'ativo' | 'finalizado';
  clientes: {
    id: string;
    id_cliente: string;
    data_criacao: string;
    cliente: {
      id: string;
      nome: string;
      num_cpf: string;
    };
  }[];
}

export interface AdicionarItensComandaDto {
  id_comanda: string;
  id_cliente: string;
  itens: {
    id_item: string;
    quantidade: number;
    observacao?: string;
    responsavel?: string;
  }[];
}

export interface AdicionarClienteComandaDto {
  id_comanda: string;
  id_cliente: string;
}

import { api } from '@/lib/axios';
import { RegisterFormData } from '@/interfaces/register';
import { Item } from './menu.service';

interface GetComandaResponse {
  comanda: ComandaResponse;
  estabelecimento: RegisterFormData;
}

export interface Solicitacao {
  id: string;
  comanda: {
    id: string;
    numero: string;
  };
  estabelecimento: {
    nome: string;
  };
  status: 'PENDENTE' | 'ACEITA' | 'RECUSADA';
}

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

  async getComandaById(id: string): Promise<GetComandaResponse | null> {
    try {
      const comandaResponse = await api.get(`/comandas/${id}`);

      if (!comandaResponse.data) {
        throw new Error('Comanda não encontrada');
      }

      const estabelecimentoResponse = await api.get(
        `/estabelecimentos/${comandaResponse.data.num_cnpj}`,
      );

      return {
        comanda: comandaResponse.data,
        estabelecimento: estabelecimentoResponse.data,
      };
    } catch (error) {
      console.error('Erro ao buscar comanda:', error);
      throw error;
    }
  },

  async adicionarItens(
    dto: AdicionarItensComandaDto,
  ): Promise<ComandaResponse> {
    try {
      const response = await api.post('/comandas/itens', dto);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar itens à comanda:', error);
      throw error;
    }
  },

  async adicionarCliente(
    dto: AdicionarClienteComandaDto,
  ): Promise<ComandaResponse> {
    try {
      const response = await api.post('/comandas/pessoas', dto);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar cliente à comanda:', error);
      throw error;
    }
  },

  async removerCliente(
    id_comanda: string,
    id_cliente: string,
  ): Promise<ComandaResponse> {
    try {
      const response = await api.delete(
        `/comandas/${id_comanda}/clientes/${id_cliente}`,
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao remover cliente da comanda:', error);
      throw error;
    }
  },

  async listarClientes(id_comanda: string): Promise<ComandaResponse> {
    try {
      const response = await api.get(`/comandas/${id_comanda}/clientes`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar clientes da comanda:', error);
      throw error;
    }
  },

  async getSolicitacoesPendentes(
    id_usuario: string,
  ): Promise<{ data: Solicitacao[] }> {
    try {
      const response = await api.get(
        `/comandas/solicitacoes/pendentes/${id_usuario}`,
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar solicitações pendentes:', error);
      throw error;
    }
  },

  async responderSolicitacao(dto: {
    id_solicitacao: string;
    status: 'ACEITA' | 'RECUSADA';
  }): Promise<void> {
    try {
      await api.post(
        `/comandas/solicitacoes/${dto.id_solicitacao}/responder`,
        dto,
      );
    } catch (error) {
      console.error('Erro ao responder solicitação:', error);
      throw error;
    }
  },
};

export default ComandaService;

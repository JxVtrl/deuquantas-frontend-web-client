export interface CreateComandaDto {
  num_cpf: string;
  num_cnpj: string;
  numMesa: string;
  data_apropriacao: string;
  status: string;
}

export interface ComandaResponse {
  id: string;
  num_cpf: string;
  num_cnpj: string;
  numMesa: string;
  status: 'ativo' | 'finalizado';
  data_criacao: string;
  conta: {
    id: string;
    id_comanda: string;
    valTotal: number;
    valDesconto?: number;
    valServico?: number;
    codFormaPg: number;
    horPagamento?: string;
    codErro?: number;
    data_criacao: string;
    data_fechamento?: string;
  };
  itens: Item[];
  pessoas?: {
    id: string;
    nome: string;
    data_criacao: string;
    valor_total: number;
    avatar: string;
  }[];
  estabelecimento?: {
    nome: string;
  };
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
  id_usuario: string;
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
  cliente: {
    id: string;
    nome: string;
  };
  status: 'PENDENTE' | 'ACEITA' | 'RECUSADA';
}

export const ComandaService = {
  async getComandasAtivas(id_usuario: string): Promise<ComandaResponse[]> {
    try {
      const response = await api.get(`/comandas/ativas/usuario/${id_usuario}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar comandas ativas:', error);
      throw error;
    }
  },

  async getComandaAtivaByUsuarioId(
    id_usuario: string,
  ): Promise<ComandaResponse[] | null> {
    console.warn('Método deprecated. Use getComandasAtivas() em seu lugar.');
    return this.getComandasAtivas(id_usuario).catch(() => null);
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
    id_usuario: string,
  ): Promise<ComandaResponse> {
    try {
      const response = await api.delete(
        `/comandas/${id_comanda}/clientes/${id_usuario}`,
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

  async getSolicitacoesPendentes(id_usuario: string): Promise<Solicitacao[]> {
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
      await api.post(`/comandas/solicitacoes/${dto.id_solicitacao}/responder`, {
        status: dto.status,
      });
    } catch (error) {
      console.error('Erro ao responder solicitação:', error);
      throw error;
    }
  },
};

export default ComandaService;

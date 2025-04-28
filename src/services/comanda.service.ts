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
      const response = await api.post('/comandas/adicionar-itens', dto);
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
      const response = await api.post('/comandas/adicionar-cliente', dto);
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
};

export default ComandaService;

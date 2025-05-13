export interface CreateComandaDto {
  num_cpf: string;
  num_cnpj: string;
  numMesa: string;
  data_apropriacao: string;
  status: string;
}

export interface ComandaPessoa {
  id: string;
  nome: string;
  data_criacao: string;
  avatar: string;
  status: 'ativo' | 'pago' | 'aguardando_split';
  valor_pago: number;
  itens_consumidos: { nome: string; quantidade: number; valor_total: number }[];
  valor_total: number;
}

export interface ItensFull {
  data_criacao: Date;
  id: string;
  id_cliente: string;
  id_comanda: string;
  id_item: string;
  observacao: string;
  valor_total: number;
  valor_unitario: number;
  item: {
    data_atualizacao: Date;
    data_criacao: Date;
    descricao: string;
    disponivel: boolean;
    estabelecimento_id: string;
    id: string;
    img: string;
    nome: string;
    preco: number;
    tipo: string;
  };
  cliente: {
    avatar: string;
    bairro: string;
    cep: string;
    cidade: string;
    complement: string;
    createdAt: Date;
    data_nascimento: Date;
    endereco: string;
    estado: string;
    id: string;
    is_ativo: boolean;
    num_celular: string;
    num_cpf: string;
    numero: string;
    updatedAt: Date;
    usuario: {
      data_atualizacao: Date;
      data_criacao: Date;
      email: string;
      id: string;
      is_admin: boolean;
      is_ativo: boolean;
      name: string;
    };
  };
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
    valServico?: number;
    codFormaPg: number;
    horPagamento?: string;
    data_criacao: string;
    data_fechamento?: string;
  };
  itens: Item[] | ItensFull[];
  clientes: ComandaPessoa[];
  estabelecimento: {
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

export interface ItemTransferSolicitacao {
  id: string;
  id_comanda_item: string;
  id_cliente_origem: string;
  id_cliente_destino: string;
  status: 'PENDENTE' | 'ACEITA' | 'RECUSADA';
  data_criacao: string;
  comandaItem?: any;
  clienteOrigem?: any;
  clienteDestino?: any;
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
      const response = await api.post('/comandas/clientes', dto);
      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar cliente à comanda:', error);
      throw error;
    }
  },

  async removerCliente(
    id_comanda: string,
    id_cliente: string,
    id_cliente_executor: string,
  ): Promise<ComandaResponse> {
    try {
      const response = await api.post('/comandas/excluir-pessoa', {
        id_comanda,
        id_cliente,
        id_cliente_executor,
      });
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

  async getComandasFinalizadas(id_usuario: string): Promise<ComandaResponse[]> {
    try {
      const response = await api.get(
        `/comandas/finalizadas/usuario/${id_usuario}`,
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar comandas finalizadas:', error);
      throw error;
    }
  },

  async getPendentesPorComanda(id_comanda: string): Promise<Solicitacao[]> {
    try {
      const response = await api.get(
        `/comandas/solicitacoes/pendentes/comanda/${id_comanda}`,
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pendentes da comanda:', error);
      throw error;
    }
  },

  async transferirItens({
    id_comanda,
    id_usuario_origem,
    id_usuario_destino,
    ids_itens,
  }: {
    id_comanda: string;
    id_usuario_origem: string;
    id_usuario_destino: string;
    ids_itens: string[];
  }): Promise<ComandaResponse> {
    try {
      const response = await api.post(`/comandas/transferir-itens`, {
        id_comanda,
        id_usuario_origem,
        id_usuario_destino,
        ids_itens,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao transferir itens:', error);
      throw error;
    }
  },

  async criarSolicitacaoTransferenciaItem(dto: {
    id_comanda_item: string;
    id_cliente_origem: string;
    id_cliente_destino: string;
  }): Promise<ItemTransferSolicitacao> {
    const response = await api.post(
      '/comandas/item-transfer-solicitacoes',
      dto,
    );
    return response.data;
  },

  async listarSolicitacoesPendentesTransferencia(
    id_cliente_destino: string,
  ): Promise<ItemTransferSolicitacao[]> {
    const response = await api.get(
      `/comandas/item-transfer-solicitacoes/pendentes/${id_cliente_destino}`,
    );
    return response.data;
  },

  async responderSolicitacaoTransferenciaItem(
    id: string,
    status: 'ACEITA' | 'RECUSADA',
  ): Promise<ItemTransferSolicitacao> {
    const response = await api.patch(
      `/comandas/item-transfer-solicitacoes/${id}/responder`,
      { status },
    );
    return response.data;
  },

  async dividirItem({
    id_comanda,
    id_item,
    ids_clientes,
  }: {
    id_comanda: string;
    id_item: string;
    ids_clientes: string[];
  }) {
    try {
      const response = await api.post('/comandas/dividir-item', {
        id_comanda,
        id_item,
        ids_clientes,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao dividir item:', error);
      throw error;
    }
  },

  async criarSolicitacaoSplitItem(dto: {
    id_comanda_item: string;
    id_cliente: string;
  }) {
    const response = await api.post('/comandas/item-split-solicitacoes', dto);
    return response.data;
  },

  async responderSolicitacaoSplitItem(
    id: string,
    status: 'ACEITA' | 'RECUSADA',
  ) {
    const response = await api.patch(
      `/comandas/item-split-solicitacoes/${id}/responder`,
      { id_solicitacao: id, status },
    );
    return response.data;
  },

  async listarSolicitacoesPendentesSplit(id_cliente: string) {
    const response = await api.get(
      `/comandas/item-split-solicitacoes/pendentes/${id_cliente}`,
    );
    return response.data;
  },
};

export default ComandaService;

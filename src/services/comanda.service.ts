import axios from 'axios';

// Definição da interface para criação de comanda
export interface CreateComandaDto {
  numCpf: string;
  numCnpj: string;
  numMesa: string;
  datApropriacao: string;
  horPedido: string;
  codItem: string;
  numQuant: number;
  valPreco: number;
}

// Definição da interface para a resposta da comanda
export interface ComandaResponse {
  numCpf: string;
  numCnpj: string;
  numMesa: string;
  datApropriacao: string;
  horPedido: string;
  codItem: string;
  numQuant: number;
  valPreco: number;
}

// URL base da API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Serviço para gerenciar comandas
 */
export const ComandaService = {
  /**
   * Cria uma nova comanda
   * @param comandaData Dados da comanda a ser criada
   * @param token Token de autenticação
   * @returns Promise com a resposta da API
   */
  async criarComanda(
    comandaData: CreateComandaDto,
    token: string,
  ): Promise<ComandaResponse> {
    try {
      const response = await axios.post(`${API_URL}/comandas`, comandaData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao criar comanda:', error);
      throw error;
    }
  },

  /**
   * Obtém as comandas de um cliente
   * @param clienteId ID do cliente (CPF)
   * @param token Token de autenticação
   * @returns Promise com a resposta da API
   */
  async getComandaByCliente(
    clienteId: string,
    token: string,
  ): Promise<ComandaResponse[]> {
    try {
      const response = await axios.get(`${API_URL}/comandas/${clienteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter comandas do cliente:', error);
      throw error;
    }
  },
};

export default ComandaService;

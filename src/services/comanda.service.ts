import axios from 'axios';

// Definição da interface para criação de comanda
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
  num_cpf: string;
  num_cnpj: string;
  numMesa: string;
  datApropriacao: string;
  horPedido: string;
  codItem: string;
  numQuant: number;
  valPreco: number;
}

// URL base da API - Tente diferentes URLs para encontrar o servidor
const possibleUrls = [
  process.env.NEXT_PUBLIC_API_URL,
  'http://localhost:3010',
  'http://127.0.0.1:3010',
  'http://backend:3010', // URL do Docker
];

// Filtra URLs vazias ou undefined
const validUrls = possibleUrls.filter((url) => url);

// URL padrão caso nenhuma das URLs acima funcione
export let API_URL = validUrls[0];

// Flag para indicar se estamos em modo offline
let isOfflineMode = false;

// Interface para comanda offline
interface OfflineComanda extends CreateComandaDto {
  createdAt: string;
  synced: boolean;
}

/**
 * Serviço para gerenciar comandas
 */
export const ComandaService = {
  /**
   * Tenta encontrar um servidor backend disponível
   * @returns Promise<string> - URL do servidor disponível ou null se nenhum estiver disponível
   */
  async findAvailableServer(): Promise<string | null> {
    // Se já estamos em modo offline, não tenta novamente
    if (isOfflineMode) {
      console.log('Modo offline ativado. Não tentando conectar ao servidor.');
      return null;
    }

    console.log('Tentando encontrar um servidor disponível...');

    // Tenta cada URL possível
    for (const url of validUrls) {
      if (!url) continue;

      try {
        console.log(`Tentando conectar a ${url}/health...`);
        await axios.get(`${url}/health`, { timeout: 3001 });
        console.log(`Servidor encontrado em ${url}`);
        API_URL = url;
        isOfflineMode = false;
        return url;
      } catch (error) {
        console.warn(`Servidor em ${url} não está disponível:`, error);
      }
    }

    console.error(
      'Nenhum servidor disponível encontrado. Ativando modo offline.',
    );
    isOfflineMode = true;
    return null;
  },

  /**
   * Verifica se o backend está acessível
   * @returns Promise<boolean> - true se o backend estiver acessível, false caso contrário
   */
  async isBackendAvailable(): Promise<boolean> {
    // Se já estamos em modo offline, retorna false imediatamente
    if (isOfflineMode) {
      return false;
    }

    try {
      const server = await this.findAvailableServer();
      return server !== null;
    } catch (error) {
      console.warn('Erro ao verificar disponibilidade do backend:', error);
      isOfflineMode = true;
      return false;
    }
  },

  async verificarDisponibilidadeMesa(
    num_cnpj: string,
    numMesa: string,
  ): Promise<boolean> {
    try {
      const response = await axios.get(
        `${API_URL}/qr-code/mesa/${num_cnpj}/${numMesa}/disponibilidade`,
      );
      return response.data.disponivel;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade da mesa:', error);
      throw error;
    }
  },

  /**
   * Obtém a comanda ativa de um cliente
   * @param clienteId ID do cliente (CPF)
   * @param token Token de autenticação
   * @returns Promise com a resposta da API
   */
  async getComandaAtivaByCliente(
    clienteId: string,
    token: string,
  ): Promise<ComandaResponse | null> {
    // Verifica se o backend está acessível
    const backendAvailable = await this.isBackendAvailable();

    // Se o backend não estiver acessível, retorna comanda ativa do localStorage
    if (!backendAvailable) {
      console.warn('Modo offline: retornando comanda ativa do localStorage');
      return this.getOfflineComandaAtiva(clienteId);
    }

    try {
      const url = `${API_URL}/comandas/ativa/${clienteId}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao buscar comanda ativa:', error);
      throw error;
    }
  },

  /**
   * Obtém a comanda ativa offline do localStorage
   * @param clienteId ID do cliente (CPF)
   * @returns Comanda ativa ou null se não encontrar
   */
  getOfflineComandaAtiva(clienteId: string): ComandaResponse | null {
    try {
      // Obtém comandas offline existentes
      const offlineComandas = JSON.parse(
        localStorage.getItem('offlineComandas') || '[]',
      ) as OfflineComanda[];

      // Filtra comandas pelo ID do cliente e status ativo
      const comandaAtiva = offlineComandas
        .filter((comanda) => comanda.num_cpf === clienteId)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0];

      return comandaAtiva || null;
    } catch (error) {
      console.error('Erro ao obter comanda ativa offline:', error);
      return null;
    }
  },
};

export default ComandaService;

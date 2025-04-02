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

// URL base da API - Tente diferentes URLs para encontrar o servidor
const possibleUrls = [
  process.env.NEXT_PUBLIC_API_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://backend:3000', // URL do Docker
  'http://backend:3001', // URL do Docker
];

// Filtra URLs vazias ou undefined
const validUrls = possibleUrls.filter((url) => url);

// URL padrão caso nenhuma das URLs acima funcione
let API_URL = validUrls[0] || 'http://localhost:3001';

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
    // Verifica se o backend está acessível
    const backendAvailable = await this.isBackendAvailable();

    // Se o backend não estiver acessível, não podemos continuar
    if (!backendAvailable) {
      throw new Error('Servidor não disponível. Tente novamente mais tarde.');
    }

    // Se chegou aqui, temos um servidor disponível
    try {
      const url = `${API_URL}/comandas`;

      console.log('Tentando criar comanda em:', url);

      const response = await axios.post(url, comandaData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        // Aumenta o timeout para 10 segundos
        timeout: 10000,
      });

      console.log('Comanda criada com sucesso:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar comanda:', error);
      throw error;
    }
  },

  /**
   * Salva uma comanda offline no localStorage para sincronização futura
   * @param comandaData Dados da comanda a ser salva
   */
  saveOfflineComanda(comandaData: CreateComandaDto): void {
    try {
      // Obtém comandas offline existentes
      const offlineComandas = JSON.parse(
        localStorage.getItem('offlineComandas') || '[]',
      );

      // Adiciona a nova comanda
      offlineComandas.push({
        ...comandaData,
        createdAt: new Date().toISOString(),
        synced: false,
      });

      // Salva no localStorage
      localStorage.setItem('offlineComandas', JSON.stringify(offlineComandas));

      console.log('Comanda salva offline para sincronização futura');
    } catch (error) {
      console.error('Erro ao salvar comanda offline:', error);
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
    // Verifica se o backend está acessível
    const backendAvailable = await this.isBackendAvailable();

    // Se o backend não estiver acessível, retorna comandas do localStorage
    if (!backendAvailable) {
      console.warn('Modo offline: retornando comandas do localStorage');
      return this.getOfflineComandas(clienteId);
    }

    try {
      const url = `${API_URL}/comandas/${clienteId}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao obter comandas do cliente:', error);

      // Se ocorrer um erro, tenta retornar comandas do localStorage
      return this.getOfflineComandas(clienteId);
    }
  },

  /**
   * Obtém comandas offline do localStorage
   * @param clienteId ID do cliente (CPF)
   * @returns Array de comandas offline
   */
  getOfflineComandas(clienteId: string): ComandaResponse[] {
    try {
      // Obtém comandas offline existentes
      const offlineComandas = JSON.parse(
        localStorage.getItem('offlineComandas') || '[]',
      ) as OfflineComanda[];

      // Filtra comandas pelo ID do cliente
      return offlineComandas
        .filter((comanda) => comanda.numCpf === clienteId)
        .map((comanda) => ({
          numCpf: comanda.numCpf,
          numCnpj: comanda.numCnpj,
          numMesa: comanda.numMesa,
          datApropriacao: comanda.datApropriacao,
          horPedido: comanda.horPedido,
          codItem: comanda.codItem,
          numQuant: comanda.numQuant,
          valPreco: comanda.valPreco,
        }));
    } catch (error) {
      console.error('Erro ao obter comandas offline:', error);
      return [];
    }
  },

  /**
   * Obtém todas as comandas offline
   * @returns Array de todas as comandas offline
   */
  getAllOfflineComandas(): ComandaResponse[] {
    try {
      // Obtém comandas offline existentes
      const offlineComandas = JSON.parse(
        localStorage.getItem('offlineComandas') || '[]',
      ) as OfflineComanda[];

      return offlineComandas.map((comanda) => ({
        numCpf: comanda.numCpf,
        numCnpj: comanda.numCnpj,
        numMesa: comanda.numMesa,
        datApropriacao: comanda.datApropriacao,
        horPedido: comanda.horPedido,
        codItem: comanda.codItem,
        numQuant: comanda.numQuant,
        valPreco: comanda.valPreco,
      }));
    } catch (error) {
      console.error('Erro ao obter todas as comandas offline:', error);
      return [];
    }
  },
};

export default ComandaService;

import { io, Socket } from 'socket.io-client';

export interface MesaSolicitacao {
  id: string;
  num_cnpj: string;
  numMesa: string;
  clienteId: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  dataSolicitacao: Date;
}

class MesaService {
  private socket: Socket | null = null;
  private static instance: MesaService;
  private isConnecting: boolean = false;
  private connectionPromise: Promise<void> | null = null;

  private constructor() {
    this.connect();
  }

  private async connect() {
    if (this.isConnecting) {
      return this.connectionPromise;
    }

    this.isConnecting = true;
    this.connectionPromise = new Promise((resolve) => {
      const apiUrl = '/api/proxy';

      this.socket = io(apiUrl, {
        path: '/socket.io',
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('Socket conectado com sucesso');
        this.isConnecting = false;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Erro na conexão do socket:', error);
      });

      this.socket.on('disconnect', () => {
        console.log('Socket desconectado');
      });
    });

    return this.connectionPromise;
  }

  public static getInstance(): MesaService {
    if (!MesaService.instance) {
      MesaService.instance = new MesaService();
    }
    return MesaService.instance;
  }

  private async ensureConnection() {
    if (!this.socket?.connected) {
      await this.connect();
    }
  }

  // Método para solicitar uma mesa
  public async solicitarMesa(
    num_cnpj: string,
    numMesa: string,
    clienteId: string,
  ) {
    await this.ensureConnection();
    this.socket?.emit('solicitar-mesa', { num_cnpj, numMesa, clienteId });
  }

  // Método para aprovar uma solicitação
  public async aprovarSolicitacao(solicitacaoId: string) {
    await this.ensureConnection();
    this.socket?.emit('aprovar-solicitacao', { solicitacaoId });
  }

  // Método para rejeitar uma solicitação
  public async rejeitarSolicitacao(solicitacaoId: string) {
    await this.ensureConnection();
    this.socket?.emit('rejeitar-solicitacao', { solicitacaoId });
  }

  // Método para ouvir atualizações de uma solicitação específica
  public async onAtualizacaoSolicitacao(
    callback: (solicitacao: MesaSolicitacao) => void,
  ) {
    await this.ensureConnection();
    this.socket?.on('atualizacao-solicitacao', callback);
  }

  // Método para ouvir novas solicitações (para o estabelecimento)
  public async onNovaSolicitacao(
    callback: (solicitacao: MesaSolicitacao) => void,
  ) {
    await this.ensureConnection();
    this.socket?.on('nova-solicitacao', callback);
  }

  // Método para remover listeners
  public removerListeners() {
    this.socket?.off('atualizacao-solicitacao');
    this.socket?.off('nova-solicitacao');
  }

  // Método para desconectar o socket
  public disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const mesaService = MesaService.getInstance();

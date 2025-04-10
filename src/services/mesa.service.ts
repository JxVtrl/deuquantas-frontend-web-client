/* eslint-disable @typescript-eslint/no-unused-vars */
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';

export interface SolicitacaoMesa {
  id: string;
  num_cnpj: string;
  numMesa: string;
  clienteId: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  dataSolicitacao: Date;
  dataAtualizacao: Date;
}

interface RoomJoinedResponse {
  room: string;
  solicitacoes: SolicitacaoMesa[];
}

export class MesaService {
  private socket: Socket | null = null;
  private static instance: MesaService;
  private listeners: Map<string, ((_solicitacao: SolicitacaoMesa) => void)[]> =
    new Map();
  private isConnecting: boolean = false;
  private currentRoom: string | null = null;

  private constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      if (this.socket?.connected) {
        console.log('[DEBUG] Socket já está conectado');
        return;
      }

      const socketUrl =
        process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3011';
      console.log('[DEBUG] Inicializando socket com URL:', socketUrl);

      this.socket = io(socketUrl, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        withCredentials: true,
        autoConnect: true,
        auth: {
          token: Cookies.get('token') || undefined,
        },
      });

      this.setupSocketListeners();
      console.log('[DEBUG] Socket inicializado com sucesso');
    } catch (error) {
      console.error('[DEBUG] Erro ao inicializar socket:', error);
      this.socket = null;
    }
  }

  private setupSocketListeners() {
    if (!this.socket) {
      console.error('[DEBUG] Socket não inicializado');
      return;
    }

    this.socket.on('connect', () => {
      console.log('[DEBUG] Conectado ao servidor Socket.IO');
      this.isConnecting = false;
    });

    // Listener específico para novas solicitações
    this.socket.on('nova-solicitacao', (solicitacao: SolicitacaoMesa) => {
      console.log('[DEBUG] Socket recebeu nova solicitação:', solicitacao);
      const callbacks = this.listeners.get('nova-solicitacao') || [];
      callbacks.forEach((callback) => {
        try {
          callback(solicitacao);
        } catch (error) {
          console.error(
            '[DEBUG] Erro ao executar callback de nova solicitação:',
            error,
          );
        }
      });
    });

    // Listener específico para atualizações de solicitações
    this.socket.on('solicitacao-atualizada', (solicitacao: SolicitacaoMesa) => {
      console.log(
        '[DEBUG] Socket recebeu atualização de solicitação:',
        solicitacao,
      );
      const callbacks = this.listeners.get('solicitacao-atualizada') || [];
      callbacks.forEach((callback) => {
        try {
          callback(solicitacao);
        } catch (error) {
          console.error(
            '[DEBUG] Erro ao executar callback de atualização:',
            error,
          );
        }
      });
    });

    this.socket.on('room-joined', (response: RoomJoinedResponse) => {
      console.log('[DEBUG] Entrou na sala:', response);
      if (response?.room) {
        this.currentRoom = response.room;
      }
    });

    this.socket.on('error', (error) => {
      console.error('[DEBUG] Erro geral do socket:', error);
    });
  }

  public static getInstance(): MesaService {
    if (!MesaService.instance) {
      MesaService.instance = new MesaService();
    }
    return MesaService.instance;
  }

  private ensureSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        console.log('[DEBUG] Socket já está conectado');
        resolve();
        return;
      }
      console.log('[DEBUG] Socket não está conectado');

      if (this.isConnecting) {
        this.socket?.once('connect', () => resolve());
        this.socket?.once('connect_error', (error) => reject(error));
        return;
      }
      console.log('[DEBUG] Iniciando conexão com o socket');

      this.isConnecting = true;
      this.initializeSocket();

      this.socket?.once('connect', () => {
        console.log('[DEBUG] Conexão estabelecida com o socket');
        this.isConnecting = false;
        resolve();
      });

      this.socket?.once('connect_error', (error) => {
        console.log('[DEBUG] Erro ao conectar com o socket');
        this.isConnecting = false;
        reject(error);
      });
    });
  }

  public async joinRoom(roomName: string): Promise<RoomJoinedResponse> {
    console.log('[DEBUG] Tentando entrar na sala:', roomName);

    try {
      await this.ensureSocket();

      return new Promise((resolve, reject) => {
        if (!this.socket) {
          console.log('[DEBUG] Socket não inicializado');
          reject(new Error('Socket não inicializado'));
          return;
        }

        // Configurar timeout
        const timeout = setTimeout(() => {
          console.log('[DEBUG] Timeout ao tentar entrar na sala');
          this.socket?.off('room-joined');
          this.socket?.off('room-join-error');
          reject(new Error('Timeout ao entrar na sala'));
        }, 60000); // Aumentado para 60 segundos

        // Configurar handlers de resposta
        const handleRoomJoined = (response: RoomJoinedResponse) => {
          console.log('[DEBUG] Sala ingressada com sucesso:', response);
          clearTimeout(timeout);
          this.currentRoom = roomName;
          this.socket?.off('room-joined', handleRoomJoined);
          this.socket?.off('room-join-error', handleError);
          resolve(response);
        };

        const handleError = (error: { message: string }) => {
          console.log('[DEBUG] Erro ao entrar na sala:', error.message);
          clearTimeout(timeout);
          this.socket?.off('room-joined', handleRoomJoined);
          this.socket?.off('room-join-error', handleError);
          reject(new Error(error.message));
        };

        // Registrar handlers
        this.socket.on('room-joined', handleRoomJoined);
        this.socket.on('room-join-error', handleError);

        // Emitir evento para entrar na sala
        console.log('[DEBUG] Emitindo evento join-room');
        this.socket.emit(
          'join-room',
          roomName,
          (
            error: { message: string } | null,
            response: RoomJoinedResponse | null,
          ) => {
            console.log('[DEBUG] Resposta do evento join-room:', response);
            if (error) {
              console.log('[DEBUG] Erro do evento join-room:', error);
              handleError(error);
            } else if (response) {
              console.log('[DEBUG] Resposta do evento join-room:', response);
              handleRoomJoined(response);
            }
          },
        );
      });
    } catch (error) {
      console.error('[DEBUG] Erro ao entrar na sala:', error);
      throw error;
    }
  }

  public async solicitarMesa(
    num_cnpj: string,
    numMesa: number,
    clienteId: string,
  ): Promise<SolicitacaoMesa> {
    try {
      await this.ensureSocket();

      return new Promise((resolve, reject) => {
        if (!this.socket) {
          reject(new Error('Socket não inicializado'));
          return;
        }

        // Configurar timeout
        const timeout = setTimeout(() => {
          console.log('[DEBUG] Timeout ao solicitar mesa');
          reject(new Error('Timeout ao solicitar mesa'));
        }, 500000); // 5 minutos

        // Configurar handlers de resposta
        const handleSolicitacaoRecebida = (response: {
          status: string;
          data?: SolicitacaoMesa;
          message?: string;
        }) => {
          clearTimeout(timeout);
          this.socket?.off('solicitacao-recebida', handleSolicitacaoRecebida);

          if (response.status === 'ok' && response.data) {
            resolve(response.data);
          } else {
            reject(new Error(response.message || 'Erro ao solicitar mesa'));
          }
        };

        // Registrar handler
        this.socket.on('solicitacao-recebida', handleSolicitacaoRecebida);

        // Emitir evento
        this.socket.emit('nova-solicitacao', { num_cnpj, numMesa, clienteId });
      });
    } catch (error) {
      console.error('Erro ao solicitar mesa:', error);
      throw error;
    }
  }

  public async aprovarSolicitacao(id: string): Promise<SolicitacaoMesa> {
    try {
      await this.ensureSocket();

      return new Promise((resolve, reject) => {
        if (!this.socket) {
          reject(new Error('Socket não inicializado'));
          return;
        }

        this.socket.emit(
          'aprovar-solicitacao',
          { id },
          (response: { error?: string; solicitacao?: SolicitacaoMesa }) => {
            if (response.error) {
              reject(new Error(response.error));
            } else if (response.solicitacao) {
              resolve(response.solicitacao);
            } else {
              reject(new Error('Resposta inválida do servidor'));
            }
          },
        );
      });
    } catch (error) {
      console.error('Erro ao aprovar solicitação:', error);
      throw error;
    }
  }

  public async rejeitarSolicitacao(id: string): Promise<SolicitacaoMesa> {
    try {
      await this.ensureSocket();

      return new Promise((resolve, reject) => {
        if (!this.socket) {
          reject(new Error('Socket não inicializado'));
          return;
        }

        this.socket.emit(
          'rejeitar-solicitacao',
          { id },
          (response: { error?: string; solicitacao?: SolicitacaoMesa }) => {
            if (response.error) {
              reject(new Error(response.error));
            } else if (response.solicitacao) {
              resolve(response.solicitacao);
            } else {
              reject(new Error('Resposta inválida do servidor'));
            }
          },
        );
      });
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
      throw error;
    }
  }

  public onNovaSolicitacao(callback: (solicitacao: SolicitacaoMesa) => void) {
    console.log('[DEBUG] Registrando listener para novas solicitações');
    const currentListeners = this.listeners.get('nova-solicitacao') || [];
    this.listeners.set('nova-solicitacao', [...currentListeners, callback]);
  }

  public onSolicitacaoUpdate(callback: (solicitacao: SolicitacaoMesa) => void) {
    console.log(
      '[DEBUG] Registrando listener para atualizações de solicitações',
    );
    const currentListeners = this.listeners.get('nova-solicitacao') || [];
    console.log('[DEBUG] Current listeners:', currentListeners);
    this.listeners.set('solicitacao-atualizada', [
      ...currentListeners,
      callback,
    ]);
  }

  public removeAllListeners() {
    console.log('[DEBUG] Removendo todos os listeners');
    this.listeners.clear();
    if (this.socket) {
      this.socket.removeAllListeners('nova-solicitacao');
      this.socket.removeAllListeners('solicitacao-atualizada');
    }
  }

  public disconnect(): void {
    this.removeAllListeners();
    this.socket?.disconnect();
    this.socket = null;
    this.currentRoom = null;
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const mesaService = MesaService.getInstance();

import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
export interface MesaSolicitacao {
  id: string;
  num_cnpj: string;
  numMesa: string;
  clienteId: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  dataSolicitacao: Date;
}

type SocketCallback = (solicitacao: MesaSolicitacao) => void;
type SocketResponse = {
  error?: string;
  data?: MesaSolicitacao;
};

class MesaService {
  private socket: Socket | null = null;
  private static instance: MesaService;
  private listeners: Map<string, SocketCallback[]> = new Map();
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
        process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002';
      console.log('[DEBUG] Inicializando socket com URL:', socketUrl);

      this.socket = io(socketUrl, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
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

      // Forçar a conexão
      this.socket.connect();

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

      if (this.currentRoom) {
        console.log('[DEBUG] Reconectando à sala:', this.currentRoom);
        this.joinRoom(this.currentRoom).catch((error) => {
          console.error('[DEBUG] Erro ao reconectar à sala:', error);
        });
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('[DEBUG] Erro na conexão Socket.IO:', error);
      this.isConnecting = false;

      // Tentar reconectar após um erro
      setTimeout(() => {
        if (!this.socket?.connected && !this.isConnecting) {
          console.log('[DEBUG] Tentando reconectar após erro...');
          this.socket?.connect();
        }
      }, 5000);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[DEBUG] Desconectado do servidor Socket.IO:', reason);
      this.isConnecting = false;

      // Tentar reconectar se não foi uma desconexão intencional
      if (reason !== 'io client disconnect') {
        setTimeout(() => {
          if (!this.socket?.connected && !this.isConnecting) {
            console.log('[DEBUG] Tentando reconectar após desconexão...');
            this.socket?.connect();
          }
        }, 5000);
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log(`[DEBUG] Reconectado após ${attemptNumber} tentativas`);
      this.isConnecting = false;
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`[DEBUG] Tentativa de reconexão ${attemptNumber}`);
      this.isConnecting = true;
    });
  }

  public static getInstance(): MesaService {
    if (!MesaService.instance) {
      MesaService.instance = new MesaService();
    }
    return MesaService.instance;
  }

  private ensureSocket() {
    if (!this.socket || !this.socket.connected) {
      console.log('[DEBUG] Socket não conectado, tentando reconectar...');
      this.initializeSocket();
    }
  }

  public async joinRoom(room: string): Promise<void> {
    console.log('[DEBUG] Tentando entrar na sala:', room);

    if (!this.socket) {
      console.error('[DEBUG] Socket não inicializado');
      throw new Error('Socket não inicializado');
    }

    // Aguardar até que o socket esteja conectado
    if (!this.socket.connected) {
      console.log('[DEBUG] Socket não está conectado. Aguardando conexão...');
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout ao aguardar conexão do socket'));
        }, 10000);

        this.socket?.on('connect', () => {
          clearTimeout(timeout);
          resolve();
        });

        this.socket?.connect();
      });
    }

    const socket = this.socket; // Capturar referência local

    return new Promise((resolve, reject) => {
      // Configurar listeners antes de emitir o evento
      const onRoomJoined = (data: { room: string; status: string }) => {
        console.log('[DEBUG] Evento room-joined recebido:', data);
        if (data.status === 'ok') {
          this.currentRoom = room;
          socket.off('room-joined', onRoomJoined);
          socket.off('room-join-error', onRoomJoinError);
          clearTimeout(timeoutId);
          resolve();
        }
      };

      const onRoomJoinError = (error: { status: string; message: string }) => {
        console.error('[DEBUG] Erro ao entrar na sala:', error);
        socket.off('room-joined', onRoomJoined);
        socket.off('room-join-error', onRoomJoinError);
        clearTimeout(timeoutId);
        reject(new Error(error.message));
      };

      // Configurar timeout para evitar espera infinita
      const timeoutId = setTimeout(() => {
        console.error('[DEBUG] Timeout ao tentar entrar na sala');
        socket.off('room-joined', onRoomJoined);
        socket.off('room-join-error', onRoomJoinError);
        reject(new Error('Timeout ao tentar entrar na sala'));
      }, 10000);

      // Adicionar listeners
      socket.on('room-joined', onRoomJoined);
      socket.on('room-join-error', onRoomJoinError);

      // Emitir evento para entrar na sala
      console.log('[DEBUG] Emitindo evento join-room para sala:', room);
      socket.emit('join-room', room);
    });
  }

  public async solicitarMesa(
    num_cnpj: string,
    numMesa: string,
    clienteId: string,
  ): Promise<SocketResponse> {
    this.ensureSocket();
    return new Promise((resolve, reject) => {
      this.socket?.emit(
        'solicitar-mesa',
        { num_cnpj, numMesa, clienteId },
        (response: SocketResponse) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        },
      );
    });
  }

  public async aprovarSolicitacao(
    solicitacaoId: string,
  ): Promise<SocketResponse> {
    this.ensureSocket();
    return new Promise((resolve, reject) => {
      this.socket?.emit(
        'aprovar-solicitacao',
        { solicitacaoId },
        (response: SocketResponse) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        },
      );
    });
  }

  public async rejeitarSolicitacao(
    solicitacaoId: string,
  ): Promise<SocketResponse> {
    this.ensureSocket();
    return new Promise((resolve, reject) => {
      this.socket?.emit(
        'rejeitar-solicitacao',
        { solicitacaoId },
        (response: SocketResponse) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response);
          }
        },
      );
    });
  }

  public onNovaSolicitacao(callback: SocketCallback): void {
    this.ensureSocket();
    const eventName = 'nova-solicitacao';

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }

    this.listeners.get(eventName)?.push(callback);
    this.socket?.on(eventName, callback);
  }

  public onSolicitacaoAtualizada(callback: SocketCallback): void {
    this.ensureSocket();
    const eventName = 'solicitacao-atualizada';

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }

    this.listeners.get(eventName)?.push(callback);
    this.socket?.on(eventName, callback);
  }

  public onAtualizacaoSolicitacao(callback: SocketCallback): void {
    this.ensureSocket();
    const eventName = 'atualizacao-solicitacao';

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }

    this.listeners.get(eventName)?.push(callback);
    this.socket?.on(eventName, callback);
  }

  public removeAllListeners(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
    this.listeners.clear();
  }

  public disconnect(): void {
    this.removeAllListeners();
    this.socket?.disconnect();
    this.socket = null;
    this.currentRoom = null;
  }
}

export const mesaService = MesaService.getInstance();

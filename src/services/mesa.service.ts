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
  private socket: Socket;
  private static instance: MesaService;

  private constructor() {
    this.socket = io(
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    );
  }

  public static getInstance(): MesaService {
    if (!MesaService.instance) {
      MesaService.instance = new MesaService();
    }
    return MesaService.instance;
  }

  // Método para solicitar uma mesa
  public solicitarMesa(num_cnpj: string, numMesa: string, clienteId: string) {
    this.socket.emit('solicitar-mesa', { num_cnpj, numMesa, clienteId });
  }

  // Método para aprovar uma solicitação
  public aprovarSolicitacao(solicitacaoId: string) {
    this.socket.emit('aprovar-solicitacao', { solicitacaoId });
  }

  // Método para rejeitar uma solicitação
  public rejeitarSolicitacao(solicitacaoId: string) {
    this.socket.emit('rejeitar-solicitacao', { solicitacaoId });
  }

  // Método para ouvir atualizações de uma solicitação específica
  public onAtualizacaoSolicitacao(
    callback: (solicitacao: MesaSolicitacao) => void,
  ) {
    this.socket.on('atualizacao-solicitacao', callback);
  }

  // Método para ouvir novas solicitações (para o estabelecimento)
  public onNovaSolicitacao(callback: (solicitacao: MesaSolicitacao) => void) {
    this.socket.on('nova-solicitacao', callback);
  }

  // Método para remover listeners
  public removerListeners() {
    this.socket.off('atualizacao-solicitacao');
    this.socket.off('nova-solicitacao');
  }
}

export const mesaService = MesaService.getInstance();

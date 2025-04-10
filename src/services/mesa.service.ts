/* eslint-disable @typescript-eslint/no-unused-vars */

import { api } from '@/lib/axios';
import { ErrorService } from '@/services/error.service';
import { SolicitacaoMesa } from './api/types';

export class MesaService {
  static async verificarDisponibilidadeMesa(
    num_cnpj: string,
    numMesa: string,
  ): Promise<boolean> {
    try {
      const response = await api.get(
        `/qr-code/mesa/${num_cnpj}/${numMesa}/disponibilidade`,
      );
      return response.data.disponivel;
    } catch (error) {
      const errorMessage = ErrorService.handleError(
        error,
        'Erro ao verificar disponibilidade da mesa',
      );
      throw new Error(errorMessage);
    }
  }

  static async solicitarMesa(
    num_cnpj: string,
    numMesa: string,
    clienteId: string,
  ): Promise<SolicitacaoMesa> {
    try {
      const response = await api.post('/solicitacoes-mesa', {
        num_cnpj,
        numMesa,
        clienteId,
        status: 'pendente',
      });
      return response.data.data;
    } catch (error) {
      const errorMessage = ErrorService.handleError(
        error,
        'Erro ao solicitar mesa',
      );
      throw new Error(errorMessage);
    }
  }

  static async verificarStatusSolicitacao(
    id: string,
  ): Promise<SolicitacaoMesa> {
    try {
      const response = await api.get(`/solicitacoes-mesa/${id}`);
      return response.data.data;
    } catch (error) {
      const errorMessage = ErrorService.handleError(
        error,
        'Erro ao verificar status da solicitação',
      );
      throw new Error(errorMessage);
    }
  }
}

export const mesaService = new MesaService();

/* eslint-disable @typescript-eslint/no-unused-vars */

import { api } from '@/lib/axios';
import { ErrorService } from '@/services/error.service';
import { SolicitacaoMesa } from './api/types';
import { useRouter } from 'next/router';

export interface Mesa {
  numMesa: string;
  numMaxPax: number;
  is_ativo: boolean;
  status: 'disponivel' | 'ocupada';
  codigoMesa: string;
  num_cnpj: string;
  data_criacao: Date;
  data_atualizacao: Date;
  qrCode: string;
}

export class MesaService {
  static async verificarSolicitacaoPendente(
    num_cnpj: string,
    numMesa: string,
    clienteId: string,
  ): Promise<SolicitacaoMesa | null> {
    try {
      const response = await api.get(
        `/solicitacoes-mesa/pendente/${num_cnpj}/${numMesa}/${clienteId}`,
      );
      return response.data.data;
    } catch (error) {
      console.error('Erro ao verificar solicitação pendente:', error);
      return null;
    }
  }

  static async verificarDisponibilidadeMesa(
    num_cnpj: string,
    numMesa: string,
    num_cpf: string,
  ): Promise<boolean> {
    try {
      const response = await api.get(
        `/qr-code/mesa/${num_cnpj}/${numMesa}/disponibilidade?num_cpf=${num_cpf}`,
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
  ): Promise<{
    success: boolean;
    data: SolicitacaoMesa | null;
    message?: string;
  }> {
    try {
      // Verifica se já existe uma solicitação pendente
      const solicitacaoPendente = await this.verificarSolicitacaoPendente(
        num_cnpj,
        numMesa,
        clienteId,
      );

      if (solicitacaoPendente) {
        return {
          success: true,
          data: solicitacaoPendente,
          message: 'Já existe uma solicitação pendente para esta mesa',
        };
      }

      // Se não existe solicitação pendente, cria uma nova
      const response = await api.post('/solicitacoes-mesa', {
        num_cnpj,
        numMesa,
        clienteId,
        status: 'pendente',
      });

      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Erro ao solicitar mesa:', error);
      return { success: false, data: null, message: 'Erro ao solicitar mesa' };
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

  static async buscarMesaPorCodigo(
    codigoMesa: string,
  ): Promise<{ success: boolean; data: Mesa; message?: string }> {
    try {
      const response = await api.get(`/mesas/codigo/${codigoMesa}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('Erro ao buscar mesa por código:', error);
      return {
        success: false,
        data: null as unknown as Mesa,
        message: 'Mesa não encontrada',
      };
    }
  }
}

export const mesaService = new MesaService();

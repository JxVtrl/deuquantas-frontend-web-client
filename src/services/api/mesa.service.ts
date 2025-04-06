import { api } from '@/lib/axios';
import { Mesa } from './types';

export class MesaService {
  static async getMesasByEstabelecimento(cnpj: string): Promise<Mesa[]> {
    const response = await api.get(`/mesas/estabelecimento/${cnpj}`);
    return response.data;
  }

  static async getMesaByNumero(numMesa: string): Promise<Mesa> {
    const response = await api.get(`/mesas/${numMesa}`);
    return response.data;
  }

  static async createMesa(data: Partial<Mesa>): Promise<Mesa> {
    const response = await api.post('/mesas', data);
    return response.data;
  }
}

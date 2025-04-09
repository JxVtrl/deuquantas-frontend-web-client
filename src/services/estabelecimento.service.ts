import axios from 'axios';
import Cookies from 'js-cookie';
import { Estabelecimento } from '@/types/estabelecimento';
import { api } from '@/lib/axios';
class EstabelecimentoService {
  async buscarEstabelecimento(id: string): Promise<Estabelecimento> {
    try {
      const response = await api.get<Estabelecimento>(
        `/estabelecimentos/${id}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Token inválido ou expirado
          Cookies.remove('token');
          window.location.href = '/login';
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }
        if (error.response?.status === 404) {
          throw new Error('Estabelecimento não encontrado.');
        }
      }
      throw new Error(
        'Erro ao buscar estabelecimento. Tente novamente mais tarde.',
      );
    }
  }
}

export default new EstabelecimentoService();

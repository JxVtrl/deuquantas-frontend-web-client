import axios from 'axios';

interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
  erro?: boolean;
}

export const cepService = {
  async getAddressByCep(cep: string) {
    try {
      const cleanCep = cep.replace(/\D/g, '');
      const response = await axios.get<CepResponse>(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
      );

      if (response.data.erro) {
        throw new Error('CEP não encontrado');
      }

      return {
        endereco: response.data.logradouro,
        bairro: response.data.bairro,
        cidade: response.data.localidade,
        estado: response.data.uf,
        cep: response.data.cep,
      };
    } catch {
      throw new Error('Erro ao buscar endereço');
    }
  },
};

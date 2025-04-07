import axios from 'axios';

export interface QrCodeData {
  numMesa: string;
  qrCode: string;
  status: string;
}

export class QrCodeService {
  static async gerarQrCode(num_cnpj: string, numMesa: string): Promise<string> {
    try {
      const response = await axios.post('/api/qr-code/gerar', {
        num_cnpj,
        numMesa,
      });
      return response.data.qrCode;
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      throw error;
    }
  }

  async getQrCodesByEstabelecimento(cnpj: string): Promise<QrCodeData[]> {
    try {
      const response = await axios.get(`/api/qr-codes/estabelecimento/${cnpj}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar QR Codes:', error);
      throw error;
    }
  }

  static async validarQrCode(
    qrCode: string,
  ): Promise<{ num_cnpj: string; numMesa: string }> {
    try {
      const response = await axios.post('/api/qr-code/validar', { qrCode });
      return response.data;
    } catch (error) {
      console.error('Erro ao validar QR Code:', error);
      throw error;
    }
  }

  static async verificarDisponibilidadeMesa(
    num_cnpj: string,
    numMesa: string,
  ): Promise<boolean> {
    try {
      const response = await axios.get(
        `/api/qr-code/mesa/${num_cnpj}/${numMesa}/disponibilidade`,
      );
      return response.data.disponivel;
    } catch (error) {
      console.error('Erro ao verificar disponibilidade da mesa:', error);
      throw error;
    }
  }
}

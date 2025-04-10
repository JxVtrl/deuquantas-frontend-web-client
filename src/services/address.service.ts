import { cepService } from './cep.service';
import { RegisterFormData } from '@/interfaces/register';
import { UseFormSetValue } from 'react-hook-form';

export class AddressService {
  static validateAddress(data: {
    cep: string;
    endereco: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
  }): boolean {
    const { cep, endereco, numero, bairro, cidade, estado } = data;
    return !!(
      cep?.replace(/\D/g, '').length === 8 &&
      endereco &&
      numero &&
      bairro &&
      cidade &&
      estado
    );
  }

  static async handleCepChange(
    cep: string,
    setValue: UseFormSetValue<RegisterFormData>,
    showError: (message: string) => void,
  ): Promise<void> {
    if (cep.length === 8) {
      try {
        const address = await cepService.getAddressByCep(cep);

        setValue('endereco', address.endereco);
        setValue('bairro', address.bairro);
        setValue('cidade', address.cidade);
        setValue('estado', address.estado);
        setValue('cep', address.cep);
      } catch {
        showError('CEP não encontrado ou inválido.');
      }
    }
  }
}

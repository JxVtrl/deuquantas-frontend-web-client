import { authService } from './auth.service';
import { RegisterFormData } from '@/interfaces/register';
import { UseFormSetError } from 'react-hook-form';

export class DocumentService {
  static async checkClientDocuments(
    numCpf: string,
    numCelular: string,
    setError: UseFormSetError<RegisterFormData>,
    showError: (message: string) => void,
  ): Promise<boolean> {
    try {
      const [cpfExists, phoneExists] = await Promise.all([
        authService.checkCPFExists(numCpf.replace(/\D/g, '')),
        authService.checkPhoneExists(numCelular.replace(/\D/g, '')),
      ]);

      if (cpfExists) {
        setError('numCpf', {
          type: 'manual',
          message: 'Este CPF já está cadastrado',
        });
        return false;
      }

      if (phoneExists) {
        setError('numCelular', {
          type: 'manual',
          message: 'Este número de celular já está cadastrado',
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar documentos:', error);
      showError('Não foi possível verificar os dados. Tente novamente.');
      return false;
    }
  }

  static async checkEstablishmentDocuments(
    numCnpj: string,
    numCelular: string,
    setError: UseFormSetError<RegisterFormData>,
    showError: (message: string) => void,
  ): Promise<boolean> {
    try {
      const [cnpjExists, phoneExists] = await Promise.all([
        authService.checkCNPJExists(numCnpj.replace(/\D/g, '')),
        authService.checkPhoneExists(numCelular.replace(/\D/g, '')),
      ]);

      if (cnpjExists) {
        setError('numCnpj', {
          type: 'manual',
          message: 'Este CNPJ já está cadastrado',
        });
        return false;
      }

      if (phoneExists) {
        setError('numCelular', {
          type: 'manual',
          message: 'Este número de celular já está cadastrado',
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar documentos do estabelecimento:', error);
      showError('Não foi possível verificar os dados. Tente novamente.');
      return false;
    }
  }
}

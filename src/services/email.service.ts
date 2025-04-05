import axios from 'axios';
import { ErrorService } from './error.service';

export class EmailService {
  static async checkEmail(
    email: string,
    showError: (message: string) => void,
  ): Promise<{ isValid: boolean; exists: boolean; message: string }> {
    try {
      // Validação básica do formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return {
          isValid: false,
          exists: false,
          message: 'Por favor, insira um email válido',
        };
      }

      const response = await axios.get(`/api/proxy/auth/check-email/${email}`);

      if (response.data.exists) {
        return {
          isValid: true,
          exists: true,
          message:
            'Este email já está cadastrado. Por favor, faça login ou use outro email.',
        };
      }

      return {
        isValid: true,
        exists: false,
        message: 'Email disponível para cadastro',
      };
    } catch (error) {
      const errorMessage = ErrorService.handleError(
        error,
        'Erro ao verificar email',
      );
      showError(errorMessage);
      return {
        isValid: false,
        exists: false,
        message: errorMessage,
      };
    }
  }
}

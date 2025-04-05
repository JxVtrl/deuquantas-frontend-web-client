import { AuthService } from './auth.service';
import { ErrorService } from './error.service';

export class EmailService {
  static async checkEmail(
    email: string,
    showError: (message: string) => void,
  ): Promise<{ isValid: boolean; exists: boolean; message?: string }> {
    try {
      const accountInfo = await AuthService.checkAccountType(email);

      if (accountInfo.hasClienteAccount) {
        return {
          isValid: false,
          exists: true,
          message:
            'Este email já está cadastrado como cliente. Por favor, faça login.',
        };
      }

      return {
        isValid: true,
        exists: false,
      };
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      const errorMessage = ErrorService.handleError(
        error,
        'Não foi possível verificar o email. Tente novamente.',
      );
      showError(errorMessage);
      return {
        isValid: false,
        exists: false,
      };
    }
  }
}

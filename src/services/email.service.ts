import { authService } from './auth.service';
import { useRouter } from 'next/navigation';

export class EmailService {
  static async checkEmail(
    email: string,
    router: ReturnType<typeof useRouter>,
    showError: (message: string) => void,
    showWarning: (message: string) => void,
  ): Promise<{ isValid: boolean; exists: boolean; message?: string }> {
    try {
      const accountInfo = await authService.checkAccountType(email);

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
      showError('Não foi possível verificar o email. Tente novamente.');
      return {
        isValid: false,
        exists: false,
      };
    }
  }
}

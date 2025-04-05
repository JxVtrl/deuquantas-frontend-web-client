import { AxiosError } from 'axios';

export class ErrorService {
  static handleError(
    error: unknown,
    defaultMessage: string = 'Ocorreu um erro inesperado',
  ): string {
    if (error instanceof AxiosError) {
      const response = error.response;

      if (!response) {
        return 'Erro de conexão. Verifique sua internet e tente novamente.';
      }

      switch (response.status) {
        case 400:
          return (
            response.data?.message ||
            'Dados inválidos. Verifique as informações e tente novamente.'
          );
        case 401:
          return 'Sessão expirada. Por favor, faça login novamente.';
        case 403:
          return 'Você não tem permissão para realizar esta ação.';
        case 404:
          return response.data?.message || 'Recurso não encontrado.';
        case 409:
          return (
            response.data?.message ||
            'Conflito de dados. Verifique as informações e tente novamente.'
          );
        case 422:
          return (
            response.data?.message ||
            'Dados inválidos. Verifique as informações e tente novamente.'
          );
        case 500:
          return 'Erro interno do servidor. Tente novamente mais tarde.';
        default:
          return response.data?.message || defaultMessage;
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return defaultMessage;
  }
}

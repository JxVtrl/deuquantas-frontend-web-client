import React, { createContext, useContext, useState, useCallback } from 'react';
import { api } from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { RegisterFormData } from '@/interfaces/register';

interface ComandaItem {
  id: string;
  quantidade: number;
  valor_total: number;
  item: {
    nome: string;
    descricao: string;
    preco: number;
  };
}

interface Conta {
  id: string;
  valConta: number;
  datConta: string;
  codFormaPg: number;
  horPagto?: string;
}

interface Comanda {
  id: string;
  numMesa: string;
  data_criacao: string;
  status: string;
  itens: ComandaItem[];
  conta?: Conta;
  valor_total: number;
}

interface ComandaContextData {
  comanda: Comanda | null;
  estabelecimento: RegisterFormData | null;
  loading: boolean;
  error: string | null;
  fetchComanda: (id: string) => Promise<void>;
  clearComanda: () => void;
  updateComanda: (data: Partial<Comanda>) => void;
}

const ComandaContext = createContext<ComandaContextData>(
  {} as ComandaContextData,
);

export const ComandaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [comanda, setComanda] = useState<Comanda | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estabelecimento, setEstabelecimento] =
    useState<RegisterFormData | null>(null);

  const fetchComanda = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(`/comandas/${id}`);

      if (!response.data) {
        throw new Error('Comanda não encontrada');
      }

      setComanda(response.data);

      const estabelecimentoResponse = await api.get(
        `/estabelecimentos/${response.data.num_cnpj}`,
      );

      setEstabelecimento(estabelecimentoResponse.data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar comanda';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearComanda = useCallback(() => {
    setComanda(null);
    setError(null);
  }, []);

  const updateComanda = useCallback((data: Partial<Comanda>) => {
    setComanda((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  return (
    <ComandaContext.Provider
      value={{
        comanda,
        estabelecimento,
        loading,
        error,
        fetchComanda,
        clearComanda,
        updateComanda,
      }}
    >
      {children}
    </ComandaContext.Provider>
  );
};

export const useComanda = () => {
  const context = useContext(ComandaContext);

  if (!context) {
    throw new Error('useComanda deve ser usado dentro de um ComandaProvider');
  }

  return context;
};

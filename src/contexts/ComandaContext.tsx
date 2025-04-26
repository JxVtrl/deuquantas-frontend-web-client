import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { RegisterFormData } from '@/interfaces/register';
import { ComandaService, ComandaResponse } from '@/services/comanda.service';
import { useAuth } from './AuthContext';
import { Item, MenuService } from '@/services/menu.service';

type Comanda = ComandaResponse & {
  status: string;
  itens: Item[];
  valor_total: number;
};

interface ComandaContextData {
  comanda: Comanda | null;
  estabelecimento: RegisterFormData | null;
  loading: boolean;
  error: string | null;
  fetchComanda: (id: string) => Promise<void>;
  fetchComandaAtiva: () => Promise<string | null>;
  clearComanda: () => void;
  updateComanda: (data: Partial<Comanda>) => void;
  selectedItem: Item | null;
  setSelectedItem: (item: Item) => void;
  itensInCart: Item[];
  setItensInCart: (itens: Item[]) => void;
  clearCart: () => void;
  tipo: string | null;
  setTipo: (tipo: string | null) => void;
  menu: Item[];
  setMenu: (menu: Item[]) => void;
  getMenu: (cnpj: string) => Promise<void>;
}

const ComandaContext = createContext<ComandaContextData>(
  {} as ComandaContextData,
);

export const ComandaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [comanda, setComanda] = useState<Comanda | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estabelecimento, setEstabelecimento] =
    useState<RegisterFormData | null>(null);
  const [itensInCart, setItensInCart] = useState<Item[]>([]);
  const [tipo, setTipo] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [menu, setMenu] = useState<Item[]>([]);

  const getMenu = async (cnpj: string) => {
    try {
      const itens = await MenuService.getItensByEstabelecimento(cnpj);
      setMenu(itens.map((item) => ({
        ...item,
        quantidade: 0,
        descricao: item.descricao || '',
      })));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComanda = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ComandaService.getComandaById(id);

      if (!response) {
        throw new Error('Comanda não encontrada');
      }

      setComanda(response.comanda as Comanda);
      setEstabelecimento(response.estabelecimento);
      await getMenu(response.estabelecimento.num_cnpj);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro ao carregar comanda';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComandaAtiva = useCallback(async () => {
    try {
      if (!user?.cliente?.num_cpf) {
        console.error('CPF do usuário não encontrado');
        return null;
      }

      setLoading(true);
      const comandaAtiva = await ComandaService.getComandaAtivaByCpf(
        user.cliente.num_cpf,
      );

      if (comandaAtiva?.id) {
        fetchComanda(comandaAtiva.id);
        return comandaAtiva.id;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar comanda ativa:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.cliente?.num_cpf]);

  const clearComanda = useCallback(() => {
    setComanda(null);
    setError(null);
  }, []);

  const updateComanda = useCallback((data: Partial<Comanda>) => {
    setComanda((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  const clearCart = useCallback(() => {
    setItensInCart([]);
    setSelectedItem(null);
  }, []);

  return (
    <ComandaContext.Provider
      value={{
        comanda,
        estabelecimento,
        loading,
        error,
        fetchComanda,
        fetchComandaAtiva,
        clearComanda,
        updateComanda,
        itensInCart,
        clearCart,
        selectedItem,
        setSelectedItem,
        setItensInCart,
        tipo,
        setTipo,
        menu,
        setMenu,
        getMenu,
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

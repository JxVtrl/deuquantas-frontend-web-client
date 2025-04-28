import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { toast } from 'react-hot-toast';
import { RegisterFormData } from '@/interfaces/register';
import { ComandaService, ComandaResponse } from '@/services/comanda.service';
import { useAuth } from './AuthContext';
import { Item, MenuService } from '@/services/menu.service';
import { useRouter } from 'next/router';

interface ComandaContextData {
  comanda: ComandaResponse | null;
  estabelecimento: RegisterFormData | null;
  loading: boolean;
  error: string | null;
  clearComanda: () => void;
  updateComanda: (data: Partial<ComandaResponse>) => void;
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
  isNavigationButtonDisabled: boolean;
  setIsNavigationButtonDisabled: (isNavigationButtonDisabled: boolean) => void;
  isCartEmptyErrorOpen: boolean;
  setIsCartEmptyErrorOpen: (isCartEmptyErrorOpen: boolean) => void;
  handleAddClick: () => void;
  adicionarUsuario: (id_usuario: string) => Promise<void>;
  removerUsuario: (id_usuario: string) => Promise<void>;
  pessoas: {
    id: string;
    nome: string;
    data_criacao: string;
    valor_total: number;
  }[];
  fetchComandaAtiva: () => Promise<void>;
  fetchComandaAtivaId: () => Promise<ComandaResponse[] | null>;
}

const ComandaContext = createContext<ComandaContextData>(
  {} as ComandaContextData,
);

export const ComandaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [comanda, setComanda] = useState<ComandaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estabelecimento, setEstabelecimento] =
    useState<RegisterFormData | null>(null);
  const [itensInCart, setItensInCart] = useState<Item[]>([]);
  const [tipo, setTipo] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [menu, setMenu] = useState<Item[]>([]);
  const [pessoas, setPessoas] = useState<
    {
      id: string;
      nome: string;
      data_criacao: string;
      valor_total: number;
    }[]
  >([]);

  const getMenu = async (cnpj: string) => {
    try {
      const itens = await MenuService.getItensByEstabelecimento(cnpj);
      setMenu(
        itens.map((item) => ({
          ...item,
          quantidade: 0,
          descricao: item.descricao || '',
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComandaAtivaId = useCallback(async () => {
    if (!user?.cliente?.num_cpf) {
      console.error('CPF do usuário não encontrado');
      return null;
    }

    const comandaAtivaId = await ComandaService.getComandaAtivaByUsuarioId(
      user.usuario.id,
    );

    return comandaAtivaId;
  }, [user?.cliente?.num_cpf, user?.usuario?.id]);

  const fetchComandaAtiva = useCallback(async () => {
    try {
      if (!user?.cliente?.num_cpf || !user?.usuario?.id) {
        console.error('CPF do usuário não encontrado');
        return;
      }

      setLoading(true);
      const comandaAtiva = await ComandaService.getComandaAtivaByUsuarioId(
        user.usuario.id,
      );

      const firstComandaAtiva = comandaAtiva?.[0];

      if (firstComandaAtiva) {
        const response = await ComandaService.getComandaById(
          firstComandaAtiva.id,
        );

        if (response) {
          setComanda(response.comanda);
          setEstabelecimento(response.estabelecimento);
          await getMenu(response.estabelecimento.num_cnpj);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar comanda ativa:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.cliente?.num_cpf]);

  const clearComanda = useCallback(() => {
    setComanda(null);
    setError(null);
  }, []);

  const updateComanda = useCallback((data: Partial<ComandaResponse>) => {
    setComanda((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  const clearCart = useCallback(() => {
    setItensInCart([]);
    setSelectedItem(null);
  }, []);

  const [isNavigationButtonDisabled, setIsNavigationButtonDisabled] =
    useState(false);
  const [isCartEmptyErrorOpen, setIsCartEmptyErrorOpen] = useState(false);

  const handleAddClick = async () => {
    if (isNavigationButtonDisabled) {
      setIsCartEmptyErrorOpen(true);
      return;
    }

    if (!router.pathname.includes('/conta/menu') && !!comanda) {
      router.push('/conta/menu');
      return;
    } else if (!comanda) {
      router.push('/qr-code');
      return;
    }

    if (!user?.cliente?.id) {
      toast.error('Cliente não encontrado');
      return;
    }

    try {
      const itensFormatados = itensInCart.map((item) => ({
        id_item: item.id,
        quantidade: item.quantidade || 1,
        observacao: item.observacao,
      }));

      await ComandaService.adicionarItens({
        id_comanda: comanda.id,
        id_cliente: user.cliente.id,
        itens: itensFormatados,
      });

      // Limpa o carrinho após adicionar os itens
      setItensInCart([]);

      // Atualiza os dados da comanda
      await fetchComandaAtiva();

      // Redireciona para a página da comanda
      router.push(`/conta/${comanda.id}`);
    } catch (error) {
      console.error('Erro ao adicionar itens à comanda:', error);
      toast.error('Erro ao adicionar itens à comanda');
    }
  };

  useEffect(() => {
    if (itensInCart.length <= 0 && router.pathname.includes('/conta/menu')) {
      setIsNavigationButtonDisabled(true);
    } else {
      setIsNavigationButtonDisabled(false);
    }
  }, [itensInCart, router.pathname]);

  const adicionarUsuario = async (id_usuario: string) => {
    if (!comanda) return;

    try {
      const response = await ComandaService.adicionarCliente({
        id_comanda: comanda.id,
        id_usuario,
      });

      setComanda(response);
      setPessoas(response.pessoas || []);
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      toast.error('Erro ao adicionar cliente à comanda');
    }
  };

  const removerUsuario = async (id_usuario: string) => {
    if (!comanda) return;

    try {
      const response = await ComandaService.removerCliente(
        comanda.id,
        id_usuario,
      );
      setComanda(response);
      setPessoas(response.pessoas || []);
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      toast.error('Erro ao remover cliente da comanda');
    }
  };

  useEffect(() => {
    if (comanda) {
      setPessoas(comanda.pessoas || []);
    }
  }, [comanda]);

  return (
    <ComandaContext.Provider
      value={{
        comanda,
        estabelecimento,
        loading,
        error,
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
        isNavigationButtonDisabled,
        setIsNavigationButtonDisabled,
        isCartEmptyErrorOpen,
        setIsCartEmptyErrorOpen,
        handleAddClick,
        adicionarUsuario,
        removerUsuario,
        pessoas,
        fetchComandaAtiva,
        fetchComandaAtivaId,
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

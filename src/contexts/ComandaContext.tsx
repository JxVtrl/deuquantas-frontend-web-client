import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { toast } from 'react-hot-toast';
import { RegisterFormData } from '@/interfaces/register';
import {
  ComandaResponse,
  ComandaService,
  ComandaPessoa,
  ItemTransferSolicitacao,
} from '@/services/comanda.service';
import { useAuth } from './AuthContext';
import { Item, MenuService } from '@/services/menu.service';
import { useRouter } from 'next/router';

// Tipos unificados de notificação
export type NotificacaoComanda =
  | {
      type: 'transferencia-item';
      id: string;
      origem: string;
      item: string;
      onAccept: () => void;
      onReject: () => void;
    }
  | {
      type: 'split-item';
      id: string;
      item: string;
      origem: string;
      onAccept: () => void;
      onReject: () => void;
    }
  | {
      type: 'limite';
      mensagem: string;
    };

interface ComandaContextData {
  comanda: ComandaResponse | null;
  comandasAtivas: ComandaResponse[];
  estabelecimento: RegisterFormData | null;
  loading: boolean;
  error: string | null;
  clearComanda: () => void;
  updateComanda: (data: Partial<ComandaResponse>) => void;
  selectedItem: Item | null;
  setSelectedItem: (item: Item | null) => void;
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
  clientes: ComandaPessoa[];
  fetchComandasAtivas: () => Promise<ComandaResponse[] | undefined>;
  fetchComanda: (id: string) => Promise<void>;
  setComandaAtiva: (
    comanda: ComandaResponse,
  ) => Promise<ComandaResponse | null>;
  fetchClientesPendentes: () => Promise<void>;
  clientesPendentes: ComandaPessoa[];
  transferSolicitacoes: ItemTransferSolicitacao[];
  fetchTransferSolicitacoes: () => Promise<void>;
  responderTransferSolicitacao: (
    id: string,
    status: 'ACEITA' | 'RECUSADA',
  ) => Promise<void>;
  splitSolicitacoes: any[];
  fetchSplitSolicitacoes: () => Promise<void>;
  responderSplitSolicitacao: (
    id: string,
    status: 'ACEITA' | 'RECUSADA',
  ) => Promise<void>;
  getNotificacoesComanda: () => NotificacaoComanda[];
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
  const [comandasAtivas, setComandasAtivas] = useState<ComandaResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estabelecimento, setEstabelecimento] =
    useState<RegisterFormData | null>(null);
  const [itensInCart, setItensInCart] = useState<Item[]>([]);
  const [tipo, setTipo] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [menu, setMenu] = useState<Item[]>([]);
  const [clientes, setClientes] = useState<ComandaPessoa[]>([]);
  const [clientesPendentes, setClientesPendentes] = useState<ComandaPessoa[]>(
    [],
  );
  const [transferSolicitacoes, setTransferSolicitacoes] = useState<
    ItemTransferSolicitacao[]
  >([]);
  const [splitSolicitacoes, setSplitSolicitacoes] = useState<any[]>([]);

  const getMenu = async (cnpj: string) => {
    try {
      const itens = await MenuService.getItensByEstabelecimento(cnpj);
      setMenu(
        itens.map((item) => ({
          ...item,
          quantidade: 0,
          descricao: item.descricao || '',
          img: item.img
            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${item.img}`
            : '/products/fallback.webp',
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComanda = useCallback(async (id: string) => {
    const response = await ComandaService.getComandaById(id);
    if (response) {
      setComanda(response.comanda);
      setEstabelecimento(response.estabelecimento);
    }
  }, []);

  const fetchComandasAtivas = useCallback(async () => {
    try {
      setLoading(true);
      const comandas = await ComandaService.getComandasAtivas(
        user?.usuario.id || '',
      );
      setComandasAtivas(comandas);
      return comandas;
    } catch (error) {
      console.error('Erro ao buscar comandas ativas:', error);
      setError('Erro ao buscar comandas ativas');
    } finally {
      setLoading(false);
    }
  }, [user?.usuario?.id, comanda]);

  const setComandaAtiva = useCallback(
    async (comandaAtiva: ComandaResponse): Promise<ComandaResponse | null> => {
      try {
        const response = await ComandaService.getComandaById(comandaAtiva.id);
        if (response) {
          setComanda(response.comanda);
          setEstabelecimento(response.estabelecimento);
          return response.comanda;
        }
      } catch (error) {
        console.error('Erro ao selecionar comanda:', error);
        toast.error('Erro ao selecionar comanda');
        return null;
      }
      return null;
    },
    [],
  );

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

    // Se ele não está na página de menu e não tem comanda, pega a ultima comanda ativa
    if (!router.pathname.includes('/conta/menu')) {
      const comandas = await fetchComandasAtivas();
      if (comandas && comandas.length > 0) {
        const ultimaComanda = comandas.sort(
          (a, b) =>
            new Date(b.data_criacao).getTime() -
            new Date(a.data_criacao).getTime(),
        )[0];
        setComanda(ultimaComanda);
        router.push('/conta/menu');
        return;
      } else {
        toast.error('Nenhuma comanda ativa encontrada');
        router.push('/qr-code');
        return;
      }
    }

    // Se ele está na página de menu clicou no botão de adicionar, adiciona os itens à comanda
    try {
      const itensFormatados = itensInCart.map((item) => ({
        id_item: item.id,
        quantidade: item.quantidade || 1,
        observacao: item.observacao,
      }));

      await ComandaService.adicionarItens({
        id_comanda: comanda?.id || '',
        id_cliente: user?.cliente.id || '',
        itens: itensFormatados,
      });

      // Limpa o carrinho após adicionar os itens
      setItensInCart([]);

      // Atualiza os dados da comanda
      await fetchComandasAtivas();

      // Redireciona para a página da comanda
      router.push(`/conta/${comanda?.id}`);
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
      setClientes(response.clientes || []);
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
        user?.usuario?.id || '',
      );
      setComanda(response);
      setClientes(response.clientes || []);
    } catch (error) {
      console.error('Erro ao remover cliente:', error);
      toast.error('Erro ao remover cliente da comanda');
    }
  };

  useEffect(() => {
    if (comanda) {
      setClientes(comanda.clientes || []);
    }
  }, [comanda]);

  const fetchClientesPendentes = useCallback(async () => {
    if (!comanda) return;
    try {
      const pendentes = await ComandaService.getPendentesPorComanda(comanda.id);
      setClientesPendentes(
        pendentes.map((p) => ({
          id: p.cliente.id,
          nome: p.cliente.nome,
          data_criacao: '',
          avatar: '',
          status: 'aguardando_split',
          valor_pago: 0,
          itens_consumidos: [],
          valor_total: 0,
        })),
      );
    } catch (error) {
      console.error('Erro ao buscar clientes pendentes:', error);
    }
  }, [comanda]);

  useEffect(() => {
    fetchClientesPendentes();
  }, [comanda, fetchClientesPendentes]);

  const fetchTransferSolicitacoes = useCallback(async () => {
    if (!user?.cliente?.id) return;
    try {
      const solicitacoes =
        await ComandaService.listarSolicitacoesPendentesTransferencia(
          user.cliente.id,
        );
      setTransferSolicitacoes(solicitacoes);
    } catch (error) {
      console.error('Erro ao buscar solicitações de transferência:', error);
    }
  }, [user?.cliente?.id]);

  const responderTransferSolicitacao = useCallback(
    async (id: string, status: 'ACEITA' | 'RECUSADA') => {
      try {
        await ComandaService.responderSolicitacaoTransferenciaItem(id, status);
        setTransferSolicitacoes((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error('Erro ao responder solicitação de transferência:', error);
      }
    },
    [],
  );

  useEffect(() => {
    fetchTransferSolicitacoes();
  }, [fetchTransferSolicitacoes, comanda]);

  const fetchSplitSolicitacoes = useCallback(async () => {
    if (!user?.cliente?.id) return;
    try {
      const solicitacoes =
        await ComandaService.listarSolicitacoesPendentesSplit(user.cliente.id);
      setSplitSolicitacoes(solicitacoes);
    } catch (error) {
      console.error('Erro ao buscar solicitações de split:', error);
    }
  }, [user?.cliente?.id]);

  const responderSplitSolicitacao = useCallback(
    async (id: string, status: 'ACEITA' | 'RECUSADA') => {
      try {
        await ComandaService.responderSolicitacaoSplitItem(id, status);
        setSplitSolicitacoes((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error('Erro ao responder solicitação de split:', error);
      }
    },
    [],
  );

  useEffect(() => {
    fetchSplitSolicitacoes();
  }, [fetchSplitSolicitacoes, comanda]);

  // Função para unificar todas as notificações
  const getNotificacoesComanda = () => {
    // Transferências de item
    const transferencias: NotificacaoComanda[] = transferSolicitacoes.map(
      (sol) => ({
        type: 'transferencia-item',
        id: sol.id,
        origem: sol.clienteOrigem?.usuario?.name || 'Alguém',
        item: sol.comandaItem?.item?.nome || 'Item',
        onAccept: () => responderTransferSolicitacao(sol.id, 'ACEITA'),
        onReject: () => responderTransferSolicitacao(sol.id, 'RECUSADA'),
      }),
    );
    // Split de item
    const splits: NotificacaoComanda[] = splitSolicitacoes.map((sol) => {
      const origemCliente = clientes.find(
        (cliente) => cliente.id === sol.comandaItem?.id_cliente,
      );
      return {
        type: 'split-item',
        id: sol.id,
        item: sol.comandaItem?.item?.nome || 'Item',
        origem: origemCliente?.nome || 'Alguém',
        onAccept: () => responderSplitSolicitacao(sol.id, 'ACEITA'),
        onReject: () => responderSplitSolicitacao(sol.id, 'RECUSADA'),
      };
    });
    return [...transferencias, ...splits];
  };

  return (
    <ComandaContext.Provider
      value={{
        comanda,
        comandasAtivas,
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
        clientes,
        fetchComandasAtivas,
        fetchComanda,
        setComandaAtiva,
        fetchClientesPendentes,
        clientesPendentes,
        transferSolicitacoes,
        fetchTransferSolicitacoes,
        responderTransferSolicitacao,
        splitSolicitacoes,
        fetchSplitSolicitacoes,
        responderSplitSolicitacao,
        // Notificações unificadas
        getNotificacoesComanda,
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

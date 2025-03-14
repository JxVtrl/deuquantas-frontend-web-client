import { withAuthCustomer } from '@/hoc/withAuth';
import React, { useState, useRef, useEffect } from 'react';
import { CustomerLayout } from '@/layout';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/router';
import { useCustomerContext } from '@/contexts/CustomerContext';
import { ComandaService, CreateComandaDto } from '@/services/comanda.service';
import { useAuthContext } from '@/contexts/AuthContext';

/**
 * Componente para escaneamento de QR Code
 *
 * NOTA PARA DESENVOLVEDORES:
 * Este componente possui um modo de teste escondido que pode ser ativado clicando
 * 5 vezes rapidamente no canto superior direito da tela. Isso mostrará um botão
 * para simular o escaneamento de um QR Code sem precisar de uma câmera real.
 * Útil para testes em ambientes de desenvolvimento.
 */
const CustomerQrCode: React.FC = () => {
  const router = useRouter();
  const { setActiveHomeTab } = useCustomerContext();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTestButton, setShowTestButton] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [testEstabelecimentoId, setTestEstabelecimentoId] =
    useState('12345678901234');
  const [testMesaId, setTestMesaId] = useState('1234');
  // Estado para mostrar dica visual durante o desenvolvimento
  const [showDevHint, setShowDevHint] = useState(false);

  // Referências para controlar os cliques
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Função para simular um QR code válido para testes
  const simularQrCode = () => {
    // Usar os valores personalizados ou os padrões
    criarComanda(testMesaId, testEstabelecimentoId);
  };

  // Função para abrir o modal de configuração
  const openTestModal = () => {
    setShowTestModal(true);
  };

  // Função para fechar o modal de configuração
  const closeTestModal = () => {
    setShowTestModal(false);
  };

  // Função para gerenciar os cliques na área secreta
  const handleSecretAreaClick = () => {
    clickCountRef.current += 1;

    // Limpa o timer anterior se existir
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    // Mostra feedback visual temporário
    setShowDevHint(true);

    // Se atingiu 5 cliques, mostra o botão
    if (clickCountRef.current >= 5) {
      setShowTestButton(true);
      clickCountRef.current = 0;
    } else {
      // Define um timer para resetar a contagem após 2 segundos
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
        setShowDevHint(false);
      }, 2000);
    }
  };

  // Atalho de teclado para mostrar o botão de teste (pressione 't' 3 vezes)
  useEffect(() => {
    const keyPressCount = { count: 0, timer: null as NodeJS.Timeout | null };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 't' || e.key === 'T') {
        keyPressCount.count += 1;

        if (keyPressCount.timer) {
          clearTimeout(keyPressCount.timer);
        }

        if (keyPressCount.count >= 3) {
          setShowTestButton(true);
          keyPressCount.count = 0;
        } else {
          keyPressCount.timer = setTimeout(() => {
            keyPressCount.count = 0;
          }, 1000);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (keyPressCount.timer) {
        clearTimeout(keyPressCount.timer);
      }
    };
  }, []);

  // Limpa o timer quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (clickTimerRef.current) {
        clearTimeout(clickTimerRef.current);
      }
    };
  }, []);

  const criarComanda = async (mesaId: string, estabelecimentoId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Obter token de autenticação do localStorage ou de onde estiver armazenado
      const token = localStorage.getItem('token') || '';

      // Verificar se o usuário está autenticado
      if (!user) {
        setError('Usuário não autenticado. Faça login novamente.');
        router.push('/customer/login');
        return;
      }

      // Obter CPF do usuário - temporariamente usando um valor fixo
      // Em produção, isso deve ser obtido do perfil do usuário ou do token JWT
      const clienteCpf = '12345678901'; // Valor temporário

      // Dados para criar a comanda
      const dataAtual = new Date().toISOString();
      const comandaData: CreateComandaDto = {
        numCpf: clienteCpf, // CPF do usuário (temporário)
        numCnpj: estabelecimentoId, // CNPJ do estabelecimento extraído do QR code
        numMesa: mesaId,
        datApropriacao: dataAtual,
        horPedido: dataAtual,
        codItem: '0', // Item inicial vazio ou padrão
        numQuant: 0,
        valPreco: 0,
      };

      // Chamada ao serviço para criar a comanda
      await ComandaService.criarComanda(comandaData, token);

      // Comanda criada com sucesso, redirecionar para a página da comanda
      router.push(`/customer/comanda/${mesaId}?clienteId=${clienteCpf}`);
      setActiveHomeTab('comanda');
    } catch (err) {
      console.error('Erro ao criar comanda:', err);
      setError(
        'Erro ao criar comanda. Verifique sua conexão e tente novamente.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomerLayout>
      {/* Área de clique para ativar o modo de teste - agora maior e com dica visual */}
      <div
        className='absolute top-0 right-0 w-24 h-24 z-10'
        style={{
          background: showDevHint ? 'rgba(255, 204, 0, 0.2)' : 'transparent',
          border: showDevHint ? '2px dashed rgba(255, 204, 0, 0.5)' : 'none',
        }}
        onClick={handleSecretAreaClick}
        aria-hidden='true'
      />

      {/* Dica de atalho de teclado */}
      <div className='fixed top-2 left-2 text-xs text-gray-400 opacity-50'>
        Dica: Pressione &quot;T&quot; 3x para modo de teste
      </div>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'>
          <span className='block sm:inline'>{error}</span>
        </div>
      )}

      {/* Botão de teste que aparece quando showTestButton é true */}
      {showTestButton && (
        <div className='fixed bottom-4 right-4 z-50'>
          <button
            onClick={simularQrCode}
            className='bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-md opacity-70 hover:opacity-100'
          >
            Simular QR Code
          </button>
          <button
            onClick={openTestModal}
            className='ml-2 bg-blue-200 text-blue-800 px-2 py-1 rounded-md shadow-md opacity-70 hover:opacity-100 text-xs'
          >
            Config
          </button>
          <button
            onClick={() => setShowTestButton(false)}
            className='ml-2 bg-red-200 text-red-800 px-2 py-1 rounded-md shadow-md opacity-70 hover:opacity-100 text-xs'
          >
            X
          </button>
        </div>
      )}

      {/* Modal de configuração para o teste */}
      {showTestModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
            <h3 className='text-lg font-medium mb-4'>Configurar Teste</h3>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                CNPJ do Estabelecimento
              </label>
              <input
                type='text'
                value={testEstabelecimentoId}
                onChange={(e) => setTestEstabelecimentoId(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                maxLength={14}
              />
              <p className='text-xs text-gray-500 mt-1'>Deve ter 14 dígitos</p>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                ID da Mesa
              </label>
              <input
                type='text'
                value={testMesaId}
                onChange={(e) => setTestMesaId(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md'
                maxLength={4}
              />
              <p className='text-xs text-gray-500 mt-1'>Deve ter 4 dígitos</p>
            </div>

            <div className='flex justify-end space-x-2'>
              <button
                onClick={closeTestModal}
                className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md'
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  closeTestModal();
                  simularQrCode();
                }}
                className='px-4 py-2 bg-blue-500 text-white rounded-md'
              >
                Testar
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className='flex justify-center items-center h-[50vh]'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFCC00]'></div>
          <p className='ml-2'>Processando QR Code...</p>
        </div>
      ) : (
        <Scanner
          styles={{
            finderBorder: 2,
            container: {
              width: '100%',
              height: '100%',
            },
            video: {
              width: '100%',
              height: '100%',
            },
          }}
          onError={(err) => {
            console.log('Erro ao escanear QR Code', err);
            setError('Erro ao escanear QR Code. Tente novamente.');
          }}
          onScan={(result) => {
            try {
              // Extrair informações do QR code
              // Formato esperado: "estabelecimento:CNPJ:mesa:ID"
              const qrData = result[0].rawValue;
              const dataParts = qrData.split(':');

              if (dataParts.length < 4 || dataParts[0] !== 'estabelecimento') {
                setError('QR Code inválido. Tente novamente.');
                return;
              }

              const estabelecimentoId = dataParts[1];
              const mesaId = dataParts[3];

              // Criar comanda e redirecionar
              criarComanda(mesaId, estabelecimentoId);
            } catch (err) {
              console.error('Erro ao processar QR Code:', err);
              setError('Erro ao processar QR Code. Formato inválido.');
            }
          }}
        />
      )}
    </CustomerLayout>
  );
};

export default withAuthCustomer(CustomerQrCode);

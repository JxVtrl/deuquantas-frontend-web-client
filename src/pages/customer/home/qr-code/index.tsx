import { withAuthCustomer } from '@/hoc/withAuth';
import React, { useState, useRef, useEffect } from 'react';
import { CustomerLayout } from '@/layout';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/router';
import { useCustomerContext } from '@/contexts/CustomerContext';
import { ComandaService, CreateComandaDto } from '@/services/comanda.service';
import { useAuthContext } from '@/contexts/AuthContext';
import axios from 'axios';

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
  // Estado para ativar o modo de bypass de autenticação para testes
  const [bypassAuth, setBypassAuth] = useState(true); // Ativado por padrão para facilitar testes
  // Estado para controlar se deve tentar criar dados reais mesmo no modo de bypass
  const [createRealData, setCreateRealData] = useState(true); // Ativado por padrão
  // Estado para indicar se estamos em modo offline
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  // Estado para mostrar mensagem de sucesso
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Referências para controlar os cliques
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Verificar status do backend ao carregar o componente
  useEffect(() => {
    const checkBackendStatus = async () => {
      const isAvailable = await ComandaService.isBackendAvailable();
      setIsOfflineMode(!isAvailable);

      if (!isAvailable) {
        console.log('Aplicação iniciada em modo offline');
      }
    };

    checkBackendStatus();
  }, []);

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

  // Função para navegar para a página da comanda com tratamento de erro
  const navegarParaComanda = (mesaId: string, clienteId: string) => {
    try {
      // Definir a aba ativa antes de navegar
      setActiveHomeTab('comanda');

      // Usar um caminho mais simples para evitar problemas de rota
      const path = `/customer/comanda/${mesaId}?clienteId=${clienteId}`;
      console.log('Redirecionando para:', path);

      // Usar setTimeout para garantir que a navegação ocorra após a atualização do estado
      setTimeout(() => {
        router.push(path).catch((err) => {
          console.error('Erro ao navegar:', err);
          setError(
            'Erro ao navegar para a página da comanda. Tente novamente.',
          );
        });
      }, 100);
    } catch (err) {
      console.error('Erro ao navegar para comanda:', err);
      setError('Erro ao navegar para a página da comanda. Tente novamente.');
    }
  };

  const criarComanda = async (mesaId: string, estabelecimentoId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);

      // Verificar se o backend está disponível
      const backendAvailable = await ComandaService.isBackendAvailable();
      setIsOfflineMode(!backendAvailable);

      if (!backendAvailable) {
        console.warn(
          'Backend não está disponível. Continuando em modo offline.',
        );

        // Mostrar mensagem de aviso sobre o modo offline
        setSuccessMessage(
          'Operando em modo offline. Os dados serão sincronizados quando o servidor estiver disponível.',
        );

        // Se estamos em modo de bypass, continuamos mesmo sem backend
        if (!bypassAuth) {
          setError(
            'Servidor não está disponível. Ative o modo de teste ou tente novamente mais tarde.',
          );
          setIsLoading(false);
          return;
        }
      }

      // Obter token de autenticação do localStorage ou de onde estiver armazenado
      const token = localStorage.getItem('token') || '';

      // Verificar se o usuário está autenticado ou se o bypass está ativado
      if (!user && !bypassAuth) {
        setError(
          'Usuário não autenticado. Faça login novamente ou ative o modo de teste.',
        );
        setIsLoading(false);
        return;
      }

      // Obter CPF do usuário - temporariamente usando um valor fixo
      // Em produção, isso deve ser obtido do perfil do usuário ou do token JWT
      const clienteCpf = user?.id ? String(user.id) : '12345678901'; // Valor temporário ou ID do usuário

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

      // Sempre tenta criar dados reais se a opção estiver ativada
      if (createRealData || !bypassAuth) {
        try {
          console.log('Tentando criar comanda real:', comandaData);
          // Usa o parâmetro isTest para indicar se deve criar uma comanda de teste
          // Se bypassAuth estiver ativado, cria uma comanda de teste
          const response = await ComandaService.criarComanda(
            comandaData,
            token,
            bypassAuth,
          );
          console.log('Comanda criada com sucesso!', response);

          // Se a resposta tem a flag isTestData, estamos em modo offline
          if (response.isTestData) {
            setSuccessMessage(
              'Comanda criada em modo offline. Os dados serão sincronizados quando o servidor estiver disponível.',
            );
          } else {
            setSuccessMessage('Comanda criada com sucesso!');
          }
        } catch (apiError) {
          console.error('Erro na API ao criar comanda:', apiError);

          // Mensagem de erro mais informativa
          let errorMessage = 'Erro ao criar comanda.';

          if (axios.isAxiosError(apiError)) {
            if (!apiError.response) {
              errorMessage =
                'Erro de conexão com o servidor. Verifique sua conexão de internet ou se o servidor está em execução.';
            } else if (apiError.response.status === 401) {
              errorMessage = 'Não autorizado. Faça login novamente.';
            } else if (apiError.response.status === 400) {
              errorMessage =
                'Dados inválidos. Verifique as informações e tente novamente.';
            } else if (apiError.response.status === 500) {
              errorMessage =
                'Erro interno do servidor. Tente novamente mais tarde.';
            }
          }

          // Se estamos em modo de bypass, continuamos mesmo com erro na API
          if (!bypassAuth) {
            setError(errorMessage);
            setIsLoading(false);
            return;
          } else {
            // Em modo de bypass, apenas mostra um aviso
            console.warn('Continuando em modo de bypass mesmo com erro na API');
            setSuccessMessage(
              'Operando em modo offline. Os dados serão sincronizados quando o servidor estiver disponível.',
            );
          }
        }
      } else if (bypassAuth) {
        // Se não estamos criando dados reais, mas estamos em modo de bypass,
        // apenas simula o processamento
        console.log(
          'Modo de teste ativado - Simulando processamento da comanda:',
          comandaData,
        );
        // Simula um atraso para parecer que está processando
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSuccessMessage('Simulação de comanda concluída com sucesso!');
      }

      // Comanda criada com sucesso, redirecionar para a página da comanda
      navegarParaComanda(mesaId, clienteCpf);
    } catch (err) {
      console.error('Erro ao criar comanda:', err);

      // Se o erro já foi tratado e definido, não sobrescreve
      if (!error) {
        setError(
          'Erro ao criar comanda. Verifique sua conexão e tente novamente.',
        );
      }
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

      {/* Indicador de modo offline */}
      {isOfflineMode && (
        <div className='fixed top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs'>
          Modo Offline
        </div>
      )}

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'>
          <span className='block sm:inline'>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4'>
          <span className='block sm:inline'>{successMessage}</span>
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
            onClick={() => setBypassAuth(!bypassAuth)}
            className={`ml-2 ${bypassAuth ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'} px-2 py-1 rounded-md shadow-md opacity-70 hover:opacity-100 text-xs`}
          >
            {bypassAuth ? 'Auth: OFF' : 'Auth: ON'}
          </button>
          <button
            onClick={() => setCreateRealData(!createRealData)}
            className={`ml-2 ${createRealData ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'} px-2 py-1 rounded-md shadow-md opacity-70 hover:opacity-100 text-xs`}
          >
            {createRealData ? 'DB: ON' : 'DB: OFF'}
          </button>
          <button
            onClick={async () => {
              const isAvailable = await ComandaService.isBackendAvailable();
              setIsOfflineMode(!isAvailable);
              setSuccessMessage(
                isAvailable
                  ? 'Servidor conectado!'
                  : 'Servidor indisponível, modo offline ativado.',
              );
              setTimeout(() => setSuccessMessage(null), 3000);
            }}
            className='ml-2 bg-purple-200 text-purple-800 px-2 py-1 rounded-md shadow-md opacity-70 hover:opacity-100 text-xs'
          >
            Testar Conexão
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

            <div className='mb-4'>
              <label className='flex items-center text-sm font-medium text-gray-700'>
                <input
                  type='checkbox'
                  checked={bypassAuth}
                  onChange={() => setBypassAuth(!bypassAuth)}
                  className='mr-2 h-4 w-4 text-blue-600'
                />
                Bypass de autenticação (apenas para testes)
              </label>
              <p className='text-xs text-gray-500 mt-1'>
                Ativa o modo de teste sem necessidade de login
              </p>
            </div>

            <div className='mb-4'>
              <label className='flex items-center text-sm font-medium text-gray-700'>
                <input
                  type='checkbox'
                  checked={createRealData}
                  onChange={() => setCreateRealData(!createRealData)}
                  className='mr-2 h-4 w-4 text-blue-600'
                />
                Criar dados reais no banco
              </label>
              <p className='text-xs text-gray-500 mt-1'>
                Tenta criar registros reais no banco de dados mesmo em modo de
                teste
              </p>
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

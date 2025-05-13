import { useComanda } from '@/contexts/ComandaContext';
import Image from 'next/image';
import {
  capitalize,
  currencyFormatter,
  timeFormatter,
} from '@/utils/formatters';
import {
  Avatar,
  Button,
  Drawer,
  MaxWidthWrapper,
} from '@deuquantas/components';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ComandaService from '@/services/comanda.service';
import SplitConfirmacaoModal from './Split/ConfirmacaoModal';
import TransferConfirmacaoModal from './Transfer/ConfirmacaoModal';

export const ItemActionsDrawer = () => {
  const { selectedItem, setSelectedItem, clientes, comanda } = useComanda();
  const { user } = useAuth();
  const [isTransferToOpen, setIsTransferToOpen] = useState(false);
  const [isTransferConfirmacaoModalOpen, setIsTransferConfirmacaoModalOpen] =
    useState(false);

  const [isSplitToOpen, setIsSplitToOpen] = useState(false);
  const [isSplitConfirmacaoModalOpen, setIsSplitConfirmacaoModalOpen] =
    useState(false);

  const [selectedOption, setSelectedOption] = useState<string[] | string>('');
  const [transferOptions, setTransferOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [splitOptions, setSplitOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    if (clientes) {
      const clienteWhoRequestedItem = clientes.find(
        (cliente) => cliente.id === selectedItem?.cliente?.id,
      );
      const filteredTransferOptions = clientes
        .filter((cliente) => cliente.id !== clienteWhoRequestedItem?.id)
        .map((cliente) => ({
          value: cliente.id,
          label: cliente.nome,
        }));
      setTransferOptions(filteredTransferOptions);

      const filteredSplitOptions = clientes.map((cliente) => ({
        value: cliente.id,
        label: cliente.nome,
      }));
      setSplitOptions(filteredSplitOptions);
    }
  }, [selectedItem]);

  const handleTransfer = async () => {
    if (!selectedItem || !selectedOption || !comanda || !user) return;
    try {
      await ComandaService.criarSolicitacaoTransferenciaItem({
        id_comanda_item: selectedItem.id,
        id_cliente_origem: user.cliente.id,
        id_cliente_destino: selectedOption[0],
      });
      setSelectedItem(null);
      setSelectedOption('');
      setIsTransferToOpen(false);
      setIsTransferConfirmacaoModalOpen(false);
    } catch (error) {
      console.error('Erro ao solicitar transferência:', error);
    }
  };

  const handleSplit = async () => {
    if (!selectedItem || !selectedOption || !comanda || !user) return;
    try {
      const clientesIds = Array.isArray(selectedOption)
        ? selectedOption
        : [selectedOption];
      const outrosClientes = clientesIds.filter((id) => id !== user.cliente.id);
      await Promise.all(
        outrosClientes.map((id_cliente) =>
          ComandaService.criarSolicitacaoSplitItem({
            id_comanda_item: selectedItem.id,
            id_cliente,
          }),
        ),
      );
      setSelectedItem(null);
      setSelectedOption('');
      setIsSplitToOpen(false);
      setIsSplitConfirmacaoModalOpen(false);
    } catch (error) {
      console.error('Erro ao dividir item:', error);
    }
  };

  if (!selectedItem) {
    return null;
  }

  const pessoasDividindo = clientes.filter(
    (cliente) =>
      cliente.id !== selectedItem?.cliente?.id &&
      cliente.id !== user?.cliente?.id,
  );

  const mesaDeUmaPessoa = clientes.length === 1;

  return (
    <>
      <Drawer isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
        <MaxWidthWrapper
          styleContent={{
            position: 'relative',
          }}
        >
          <button
            onClick={() => setSelectedItem(null)}
            className='absolute top-[16px] right-[16px]'
          >
            <svg
              width='10'
              height='10'
              viewBox='0 0 10 10'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M1.26659 9.66671L0.333252 8.73337L4.06659 5.00004L0.333252 1.26671L1.26659 0.333374L4.99992 4.06671L8.73325 0.333374L9.66659 1.26671L5.93325 5.00004L9.66659 8.73337L8.73325 9.66671L4.99992 5.93337L1.26659 9.66671Z'
                fill='#272727'
              />
            </svg>
          </button>

          <div className='flex flex-col gap-[16px] py-6 transition-all duration-300'>
            <div className='flex gap-[8px]'>
              <Image
                src={selectedItem.img || '/products/fallback.webp'}
                alt={selectedItem.nome || ''}
                width={100}
                height={100}
              />
              <div className='flex flex-col gap-[4px]'>
                <h1 className='text-[12px] font-[600] leading-[16px] tracking-[0.5px] text-[#000000]'>
                  {capitalize(selectedItem?.nome || '')}
                </h1>
                <p className='text-[12px] font-[400] leading-[16px] tracking-[0.5px] text-[#000000]'>
                  Pedido às {timeFormatter(new Date(selectedItem.data_criacao))}{' '}
                  | Pedido N° {selectedItem.id}
                </p>
                <p className='text-[12px] font-[400] leading-[16px] tracking-[0.5px] text-[#000000]'>
                  Atendido por {'Gomes'}
                </p>

                <p className='text-[14px] font-[600] leading-[20px] tracking-[0.5px] text-[#272727]'>
                  {currencyFormatter(selectedItem.preco || 0)}
                </p>
              </div>
            </div>
            {mesaDeUmaPessoa ? (<>
              <Button variant='underline' text='Não fiz esse pedido' />
            </>) : selectedItem.status === 'ativo-dividido' ? (
              <div className='grid grid-cols-2 gap-[12px]'>
                <p className='text-[14px] font-[600] leading-[20px] tracking-[0.5px] text-[#272727]'>
                  Dividido com{' '}
                  {pessoasDividindo.map((cliente) => cliente.nome).join(', ')}
                </p>
                <Button variant='underline' text='Não fiz esse pedido' />
              </div>
            ) : (
              <div className='grid grid-cols-3 gap-[12px]'>
                <Button
                  variant='primary'
                  onClick={() => {
                    setIsTransferToOpen(!isTransferToOpen);
                    setIsSplitToOpen(false);
                  }}
                  text='Transferir item'
                />
                <Button
                  variant='primary'
                  onClick={() => {
                    setIsSplitToOpen(!isSplitToOpen);
                    setIsTransferToOpen(false);
                  }}
                  text='Dividir item'
                />
                <Button variant='underline' text='Não fiz esse pedido' />
              </div>
            )}
          </div>

          <motion.div
            initial={{
              opacity: 0,
              y: 100,
              visibility: 'hidden',
              height: 0,
              overflow: 'hidden',
              marginBottom: '0px',
            }}
            animate={{
              opacity: isTransferToOpen ? 1 : 0,
              visibility: isTransferToOpen ? 'visible' : 'hidden',
              y: isTransferToOpen ? 0 : 100,
              height: isTransferToOpen ? 'auto' : 0,
              overflow: isTransferToOpen ? 'visible' : 'hidden',
              marginBottom: isTransferToOpen ? '32px' : '0',
            }}
            exit={{
              opacity: 0,
              y: 100,
              visibility: 'hidden',
              height: 0,
              overflow: 'hidden',
              marginBottom: '81px',
            }}
            transition={{ duration: 0.3 }}
            className='flex flex-col gap-[16px]'
          >
            <div className='flex flex-row items-center gap-[8px]'>
              <label className='text-[12px] font-[500] leading-[12px] text-[#272727] text-nowrap'>
                Transferir item para:
              </label>
              <select
                value={selectedOption[0]}
                onChange={(e) => setSelectedOption([e.target.value])}
                className='w-full p-0 border rounded h-[24px] text-[14px] font-[400] leading-[20px] tracking-[0.5px] text-[#272727] px-[8px] bg-[#FFFFFF] border-[#D9D9D9]'
              >
                <option
                  value=''
                  className='text-[12px] font-[400] leading-[12px] tracking-[0] text-[#272727]'
                >
                  Selecione uma pessoa
                </option>
                {transferOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className='text-[12px] font-[400] leading-[12px] tracking-[0] text-[#272727]'
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex flex-row gap-[16px]'>
              {clientes.map((cliente) => {
                const bgColor = selectedOption.includes(cliente.id)
                  ? '#FFCC00'
                  : cliente.status === 'pago'
                    ? 'rgb(21, 128, 61)'
                    : '#F0F0F0';

                const isClientWhoRequestedItem =
                  cliente.id === selectedItem?.cliente?.id;

                if (isClientWhoRequestedItem) {
                  return null;
                }

                return (
                  <div
                    key={cliente.id}
                    className='flex items-center cursor-pointer'
                    onClick={() => {
                      if (typeof selectedOption === 'string') {
                        if (selectedOption === cliente.id) {
                          setSelectedOption('');
                        } else {
                          setSelectedOption(cliente.id);
                        }
                      } else {
                        if (
                          selectedOption.includes(cliente.id) &&
                          selectedOption.length > 1
                        ) {
                          const newSelectedOption = selectedOption.filter(
                            (option) => option !== cliente.id,
                          );
                          setSelectedOption(newSelectedOption);
                        } else {
                          setSelectedOption([...selectedOption, cliente.id]);
                        }
                      }
                    }}
                  >
                    <Avatar
                      key={cliente.id}
                      name={cliente.nome}
                      bgColor={bgColor}
                    />
                  </div>
                );
              })}
            </div>

            <motion.div
              initial={{
                opacity: 0,
                y: 50,
                height: 0,
              }}
              animate={{
                opacity:
                  selectedOption.length > 0 &&
                    transferOptions.find((option) =>
                      selectedOption.includes(option.value),
                    )
                    ? 1
                    : 0,
                y:
                  selectedOption.length > 0 &&
                    transferOptions.find((option) =>
                      selectedOption.includes(option.value),
                    )
                    ? 0
                    : 50,
                height:
                  selectedOption.length > 0 &&
                    transferOptions.find((option) =>
                      selectedOption.includes(option.value),
                    )
                    ? 'auto'
                    : 0,
              }}
              exit={{ opacity: 0, y: 50, height: 0 }}
              transition={{ duration: 0.3 }}
              className='flex flex-col gap-[8px]'
            >
              <p className='text-[14px] font-[500] leading-[20px] tracking-[0.1px] text-[#272727]'>
                Transferir item para{' '}
                {
                  transferOptions.find((option) =>
                    selectedOption.includes(option.value),
                  )?.label
                }
                ?
              </p>
              <div className='grid grid-cols-2 items-center justify-between gap-[8px]'>
                <Button
                  type='submit'
                  variant='tertiary'
                  text='Transferir'
                  onClick={() => {
                    setIsTransferConfirmacaoModalOpen(true);
                  }}
                />
                <Button
                  variant='underline'
                  text='Cancelar'
                  onClick={() => {
                    setIsTransferToOpen(false);
                    setSelectedOption([]);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 100,
              visibility: 'hidden',
              height: 0,
              overflow: 'hidden',
              marginBottom: '0px',
            }}
            animate={{
              opacity: isSplitToOpen ? 1 : 0,
              visibility: isSplitToOpen ? 'visible' : 'hidden',
              y: isSplitToOpen ? 0 : 100,
              height: isSplitToOpen ? 'auto' : 0,
              overflow: isSplitToOpen ? 'visible' : 'hidden',
              marginBottom: isSplitToOpen ? '32px' : '0',
            }}
            exit={{
              opacity: 0,
              y: 100,
              visibility: 'hidden',
              height: 0,
              overflow: 'hidden',
              marginBottom: '81px',
            }}
            transition={{ duration: 0.3 }}
            className='flex flex-col gap-[16px]'
          >
            <div className='flex flex-row items-center gap-[8px]'>
              <label className='text-[12px] font-[500] leading-[12px] text-[#272727] text-nowrap'>
                Dividir item com:
              </label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value.split(','))}
                className='w-full p-0 border rounded h-[24px] text-[14px] font-[400] leading-[20px] tracking-[0.5px] text-[#272727] px-[8px] bg-[#FFFFFF] border-[#D9D9D9]'
              >
                <option
                  value=''
                  className='text-[12px] font-[400] leading-[12px] tracking-[0] text-[#272727]'
                >
                  Selecione uma ou várias pessoas
                </option>
                {splitOptions.map((option) => {
                  if (
                    option.value === selectedItem?.cliente?.id &&
                    option.value === user?.cliente?.id
                  ) {
                    return null;
                  }

                  return (
                    <option
                      key={option.value}
                      value={option.value}
                      className='text-[12px] font-[400] leading-[12px] tracking-[0] text-[#272727]'
                    >
                      {option.label}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className='flex flex-row gap-[16px]'>
              {clientes.map((cliente) => {
                const bgColor = selectedOption.includes(cliente.id)
                  ? '#FFCC00'
                  : cliente.status === 'pago'
                    ? 'rgb(21, 128, 61)'
                    : '#F0F0F0';

                if (
                  cliente.id === selectedItem?.cliente?.id &&
                  cliente.id === user?.cliente?.id
                ) {
                  return null;
                }

                return (
                  <div
                    key={cliente.id}
                    className='flex items-center cursor-pointer'
                    onClick={() => {
                      if (typeof selectedOption === 'string') {
                        if (selectedOption === cliente.id) {
                          setSelectedOption([]);
                        } else {
                          setSelectedOption([cliente.id]);
                        }
                      } else {
                        if (selectedOption.includes(cliente.id)) {
                          const newSelectedOption = selectedOption.filter(
                            (option) => option !== cliente.id,
                          );
                          setSelectedOption(newSelectedOption);
                        } else {
                          setSelectedOption([...selectedOption, cliente.id]);
                        }
                      }
                    }}
                  >
                    <Avatar
                      key={cliente.id}
                      name={cliente.nome}
                      bgColor={bgColor}
                    />
                  </div>
                );
              })}
            </div>

            <motion.div
              initial={{
                opacity: 0,
                y: 50,
                height: 0,
              }}
              animate={{
                opacity:
                  selectedOption.length > 0 &&
                    splitOptions.find((option) =>
                      selectedOption.includes(option.value),
                    )
                    ? 1
                    : 0,
                y:
                  selectedOption.length > 0 &&
                    splitOptions.find((option) =>
                      selectedOption.includes(option.value),
                    )
                    ? 0
                    : 50,
                height:
                  selectedOption.length > 0 &&
                    splitOptions.find((option) =>
                      selectedOption.includes(option.value),
                    )
                    ? 'auto'
                    : 0,
              }}
              exit={{ opacity: 0, y: 50, height: 0 }}
              transition={{ duration: 0.3 }}
              className='flex flex-col gap-[8px]'
            >
              <p className='text-[14px] font-[500] leading-[20px] tracking-[0.1px] text-[#272727]'>
                Dividir item com{' '}
                {splitOptions
                  .filter((option) => selectedOption.includes(option.value))
                  .map((option) => option.label)
                  .join(', ')}
                ?
              </p>
              <div className='grid grid-cols-2 items-center justify-between gap-[8px]'>
                <Button
                  type='submit'
                  variant='tertiary'
                  text='Dividir'
                  onClick={() => {
                    setIsSplitConfirmacaoModalOpen(true);
                  }}
                />
                <Button
                  variant='underline'
                  text='Cancelar'
                  onClick={() => {
                    setIsSplitToOpen(false);
                    setSelectedOption([]);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          <div
            style={{
              height: `81px`,
            }}
          ></div>
        </MaxWidthWrapper>
      </Drawer>
      <SplitConfirmacaoModal
        isOpen={isSplitConfirmacaoModalOpen}
        onClose={() => setIsSplitConfirmacaoModalOpen(false)}
        onConfirm={handleSplit}
        clientesIds={selectedOption}
        item={selectedItem}
      />
      <TransferConfirmacaoModal
        isOpen={isTransferConfirmacaoModalOpen}
        onClose={() => setIsTransferConfirmacaoModalOpen(false)}
        onConfirm={handleTransfer}
        clienteId={selectedOption[0]}
        item={selectedItem}
      />
    </>
  );
};

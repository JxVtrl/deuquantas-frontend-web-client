import { useComanda } from '@/contexts/ComandaContext';
import { useAuth } from '@/contexts/AuthContext';
import { currencyFormatter } from '@/utils/formatters';
import { Avatar, Button, MaxWidthWrapper } from '@deuquantas/components';
import React, { useEffect, useState } from 'react';
import { AdicionarPessoaModal } from './AdicionarPessoaModal';
import { ExcluirPessoaModal } from './ExcluirPessoaModal';
import ExcluirConfirmacaoModal from './ExcluirConfirmacaoModal';
import ComandaService from '@/services/comanda.service';

export const ComandaPessoas = () => {
  const { clientes, comanda, clientesPendentes } = useComanda();
  const { user } = useAuth();

  const [isAdicionarModalOpen, setIsAdicionarModalOpen] = useState(false);
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);
  const [isExcluirConfirmacaoModalOpen, setIsExcluirConfirmacaoModalOpen] =
    useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    [],
  );

  const isCriador =
    clientes && clientes.length > 0 && clientes[0].id === user?.usuario?.id;

  const criadorId = clientes[0]?.id;

  useEffect(() => {
    if (clientes) {
      const filteredOptions = clientes
        .filter((cliente) => cliente.id !== criadorId)
        .map((cliente) => ({
          value: cliente.id,
          label: cliente.nome,
        }));
      setOptions(filteredOptions);
    }
  }, [clientes, criadorId]);

  const handleExclude = async () => {
    if (selectedOption) {
      try {
        const id_comanda = comanda?.id || '';

        await ComandaService.removerCliente(
          id_comanda,
          selectedOption,
          user?.usuario?.id || '',
        );
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsExcluirConfirmacaoModalOpen(false);
        setSelectedOption('');
      }
    }
  };

  return (
    <MaxWidthWrapper
      styleContent={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '20px',
        height: '100%',
      }}
    >
      <div>
        <span className='text-[12px] font-[500] text-[#272727] leading-[12px]'>
          Integrantes
        </span>
        <div className='flex flex-col h-full overflow-y-auto'>
          {clientes?.map((cliente) => (
            <div
              key={cliente.id}
              className='flex items-center justify-between gap-[8px] border-t border-[#E0E0E0] py-[10px] cursor-pointer'
            >
              <div className='flex items-center gap-[12px]'>
                <div style={{ opacity: cliente.status === 'pago' ? 0.5 : 1 }}>
                  <Avatar
                    name={cliente.nome}
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${cliente.avatar}`}
                    bgColor={
                      cliente.id === user?.usuario?.id ? '#FFCC00' : 'muted'
                    }
                  />
                </div>
                <span
                  className='text-[16px] font-[500] text-[#000000] leading-[16px]'
                  style={{
                    color:
                      cliente.status === 'pago'
                        ? 'rgb(21, 128, 61)'
                        : '#000000',
                  }}
                >
                  {cliente.nome}
                </span>
              </div>
              <span
                className='text-[16px] font-[500] leading-[16px]'
                style={{
                  color:
                    cliente.status === 'pago' ? 'rgb(21, 128, 61)' : '#737373',
                }}
              >
                {currencyFormatter(cliente.valor_total)}
              </span>
            </div>
          ))}

        </div>
      </div>
      <div>
        <span className='text-[12px] font-[500] text-[#272727] leading-[12px]'>
          Pendentes
        </span>
        <div className='flex flex-col h-full overflow-y-auto'>
          {clientesPendentes?.map((cliente) => (
            <div key={cliente.id} className='flex items-center justify-between gap-[8px] border-t border-[#E0E0E0] py-[10px] cursor-pointer'>
              <div className='flex items-center gap-[12px]'>
                <Avatar
                  name={cliente.nome}
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${cliente.avatar}`}
                  bgColor='muted'
                />
                <span className='text-[16px] font-[500] leading-[16px]'>
                  {cliente.nome}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isCriador && (
        <div className='flex flex-col items-center justify-between gap-[8px] pt-[15px]'>
          <Button
            variant='tertiary'
            text='ADICIONAR PESSOA'
            onClick={() => setIsAdicionarModalOpen(true)}
          />
          <Button
            variant='secondary'
            text='EXCLUIR PESSOA'
            onClick={() => setIsExcluirModalOpen(true)}
          />
        </div>
      )}

      <AdicionarPessoaModal
        isOpen={isAdicionarModalOpen}
        onClose={() => setIsAdicionarModalOpen(false)}
      />

      <ExcluirPessoaModal
        isOpen={isExcluirModalOpen}
        onClose={() => setIsExcluirModalOpen(false)}
        onConfirm={() => {
          setIsExcluirModalOpen(false);
          setIsExcluirConfirmacaoModalOpen(true);
        }}
        options={options}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        criadorId={criadorId}
      />

      <ExcluirConfirmacaoModal
        isOpen={isExcluirConfirmacaoModalOpen}
        onConfirm={() => {
          setIsExcluirConfirmacaoModalOpen(false);
          handleExclude();
        }}
        onClose={() => {
          setIsExcluirConfirmacaoModalOpen(false);
          setSelectedOption('');
        }}
        clienteId={selectedOption}
      />
    </MaxWidthWrapper>
  );
};

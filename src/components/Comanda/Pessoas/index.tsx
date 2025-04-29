import { useComanda } from '@/contexts/ComandaContext';
import { useAuth } from '@/contexts/AuthContext';
import { currencyFormatter } from '@/utils/formatters';
import { Avatar, Button, MaxWidthWrapper } from '@deuquantas/components';
import React, { useEffect, useState } from 'react';
import { AdicionarPessoaModal } from './AdicionarPessoaModal';
import { ExcluirPessoaModal } from './ExcluirPessoaModal';

export const ComandaPessoas = () => {
  const { comanda, fetchComandaAtiva } = useComanda();
  const { user } = useAuth();
  const pessoas = comanda?.pessoas;

  const [isAdicionarModalOpen, setIsAdicionarModalOpen] = useState(false);
  const [isExcluirModalOpen, setIsExcluirModalOpen] = useState(false);

  const isCriador =
    pessoas && pessoas.length > 0 && pessoas[0].id === user?.usuario?.id;

  useEffect(() => {
    const interval = setInterval(() => {
      fetchComandaAtiva();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchComandaAtiva]);

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
          {pessoas?.map((pessoa) => (
            <div
              key={pessoa.id}
              className='flex items-center justify-between gap-[8px] border-t border-[#E0E0E0] py-[10px]'
            >
              <div className='flex items-center gap-[12px]'>
                <Avatar
                  name={pessoa.nome}
                  src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${pessoa.avatar}`}
                  bgColor={
                    pessoa.id === user?.usuario?.id ? '#FFCC00' : 'muted'
                  }
                />
                <span className='text-[16px] font-[500] text-[#000000] leading-[16px]'>
                  {pessoa.nome}
                </span>
              </div>
              <span className='text-[16px] font-[500] text-[#737373] leading-[16px]'>
                {currencyFormatter(pessoa.valor_total)}
              </span>
            </div>
          ))}
        </div>
      </div>
      {isCriador && (
        <div className='flex flex-col items-center justify-between gap-[8px] pt-[15px]'>
          <Button
            variant='primary'
            text='Adicionar Pessoa'
            onClick={() => setIsAdicionarModalOpen(true)}
          />
          <Button
            variant='secondary'
            text='Excluir Pessoa'
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
      />
    </MaxWidthWrapper>
  );
};

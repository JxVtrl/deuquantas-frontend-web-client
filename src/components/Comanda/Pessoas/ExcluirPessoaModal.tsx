import React, { useState } from 'react';
import { Button, Drawer, MaxWidthWrapper } from '@deuquantas/components';
import { useComanda } from '@/contexts/ComandaContext';
import { comandaService } from '@/services/api/comanda';
import { toast } from 'react-hot-toast';

interface ExcluirPessoaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcluirPessoaModal: React.FC<ExcluirPessoaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { comanda, fetchComanda } = useComanda();
  const [selectedPessoa, setSelectedPessoa] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comanda || !selectedPessoa) return;

    try {
      await comandaService.excluirPessoa({
        id_comanda: comanda.id,
        id_usuario: selectedPessoa,
      });

      await fetchComanda(comanda.id);
      toast.success('Pessoa removida com sucesso!');
      onClose();
    } catch {
      toast.error('Erro ao remover pessoa');
    }
  };

  const pessoas = comanda?.pessoas || [];
  const criadorId = pessoas[0]?.id;

  const options = pessoas
    .filter((pessoa) => pessoa.id !== criadorId)
    .map((pessoa) => ({
      value: pessoa.id,
      label: pessoa.nome,
    }));

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <MaxWidthWrapper>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4 pb-[81px] py-6'
        >
          <select
            value={selectedPessoa}
            onChange={(e) => setSelectedPessoa(e.target.value)}
            className='w-full p-2 border rounded'
          >
            <option value=''>Selecione uma pessoa</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className='flex flex-col items-center justify-between gap-[8px] pt-[15px]'>
            <Button variant='secondary' text='Cancelar' onClick={onClose} />
            <Button type='submit' variant='primary' text='Excluir' />
          </div>
        </form>
      </MaxWidthWrapper>
    </Drawer>
  );
};

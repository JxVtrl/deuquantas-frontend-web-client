import React, { useState } from 'react';
import { Button, Drawer, MaxWidthWrapper } from '@deuquantas/components';
import { useComanda } from '@/contexts/ComandaContext';
import { comandaService } from '@/services/api/comanda';
import { toast } from 'react-hot-toast';

interface AdicionarPessoaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdicionarPessoaModal: React.FC<AdicionarPessoaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { comanda, fetchComanda } = useComanda();
  const [cpf, setCpf] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comanda) return;

    try {
      await comandaService.adicionarPessoa({
        id_comanda: comanda.id,
        id_usuario: cpf,
      });

      await fetchComanda(comanda.id);
      toast.success('Pessoa adicionada com sucesso!');
      onClose();
    } catch {
      toast.error('Erro ao adicionar pessoa');
    }
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <MaxWidthWrapper>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4 pb-[81px]  py-6'
        >
          <input
            placeholder='Digite o CPF da pessoa'
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className='w-full p-2 border rounded'
          />
          <div className='flex flex-col items-center justify-between gap-[8px] pt-[15px]'>
            <Button variant='secondary' text='Cancelar' onClick={onClose} />
            <Button type='submit' variant='primary' text='Adicionar' />
          </div>
        </form>
      </MaxWidthWrapper>
    </Drawer>
  );
};

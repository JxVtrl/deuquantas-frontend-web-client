import React, { useState, useEffect } from 'react';
import { Button, Drawer, MaxWidthWrapper } from '@deuquantas/components';
import { useComanda } from '@/contexts/ComandaContext';
import { toast } from 'react-hot-toast';
import { api } from '@/lib/axios';
import ComandaService from '@/services/comanda.service';

interface AdicionarPessoaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Usuario {
  id: string;
  name: string;
  email: string;
  cliente: {
    num_cpf: string;
  };
}

export const AdicionarPessoaModal: React.FC<AdicionarPessoaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { comanda, fetchComandasAtivas } = useComanda();
  const [busca, setBusca] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarUsuarios = async () => {
    if (busca.length < 3) {
      setUsuarios([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(`/usuarios/buscar?nome=${busca}`);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao buscar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comanda) return;

    try {
      await ComandaService.adicionarCliente({
        id_comanda: comanda.id,
        id_usuario: busca,
      });

      await fetchComandasAtivas();
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
          className='flex flex-col gap-4 mb-[81px] py-6'
        >
          <div className='relative'>
            <div className='flex flex-col gap-[8px]'>
              <label
                htmlFor='cpf'
                className='text-[12px] font-[500] text-[#272727] leading-[12px]'
              >
                Adicionar:
              </label>
              <input
                placeholder='Digite o nome ou CPF da pessoa'
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className='w-full p-2 border rounded'
                id='cpf'
              />
            </div>
            {loading && (
              <div className='absolute right-2 top-2'>
                <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900'></div>
              </div>
            )}
            {usuarios.length > 0 && (
              <div className='absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg'>
                {usuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className='p-2 hover:bg-gray-100 cursor-pointer'
                    onClick={() => {
                      setBusca(usuario.cliente.num_cpf);
                      setUsuarios([]);
                    }}
                  >
                    <p className='font-medium'>{usuario.name}</p>
                    <p className='text-sm text-gray-600'>{usuario.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className='grid grid-cols-2 gap-[8px] pt-[15px]'>
            <Button type='submit' variant='tertiary' text='Adicionar' />
            <Button variant='underline' text='Cancelar' onClick={onClose} />
          </div>
        </form>
      </MaxWidthWrapper>
    </Drawer>
  );
};

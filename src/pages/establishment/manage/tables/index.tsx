/* eslint-disable react-hooks/exhaustive-deps */
import { api } from '@/lib/axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Mesa } from '@/services/api/types';
import { withAuthEstablishment } from '@/hoc/withAuth';
import EstablishmentLayout from '@/layout/EstablishmentLayout';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ManageTables: React.FC = () => {
  const { user } = useAuth();
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    numMesa: '',
    numMaxPax: '',
    is_ativo: true,
  });

  useEffect(() => {
    fetchMesas();
  }, []);

  const fetchMesas = async () => {
    if (!user?.estabelecimento?.num_cnpj) return;

    try {
      const response = await api.get(
        `/mesas/estabelecimento/${user.estabelecimento.num_cnpj}`,
      );
      setMesas(response.data);
    } catch (error) {
      console.error('Erro ao buscar mesas:', error);
      toast.error('Erro ao carregar mesas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post('/mesas', {
        ...formData,
        num_cnpj: user?.estabelecimento?.num_cnpj,
        numMaxPax: parseInt(formData.numMaxPax),
      });
      toast.success('Mesa criada com sucesso');
      setIsCreateDialogOpen(false);
      fetchMesas();
    } catch (error) {
      console.error('Erro ao criar mesa:', error);
      toast.error('Erro ao criar mesa');
    }
  };

  const handleEdit = async () => {
    if (!selectedMesa) return;

    try {
      await api.put(`/mesas/${selectedMesa.numMesa}`, {
        numMesa: formData.numMesa,
        numMaxPax: parseInt(formData.numMaxPax),
        is_ativo: formData.is_ativo,
      });
      toast.success('Mesa atualizada com sucesso');
      setIsEditDialogOpen(false);
      fetchMesas();
    } catch (error) {
      console.error('Erro ao atualizar mesa:', error);
      toast.error('Erro ao atualizar mesa');
    }
  };

  const handleDelete = async (mesa: Mesa) => {
    if (!confirm('Tem certeza que deseja excluir esta mesa?')) return;

    try {
      await api.delete(`/mesas/${mesa.numMesa}`);
      toast.success('Mesa excluída com sucesso');
      fetchMesas();
    } catch (error) {
      console.error('Erro ao excluir mesa:', error);
      toast.error('Erro ao excluir mesa');
    }
  };

  const handleView = (mesa: Mesa) => {
    setSelectedMesa(mesa);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (mesa: Mesa) => {
    setSelectedMesa(mesa);
    setFormData({
      numMesa: mesa.numMesa,
      numMaxPax: mesa.numMaxPax.toString(),
      is_ativo: mesa.is_ativo,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <EstablishmentLayout>
      <div className='p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Gerenciamento de Mesas</h1>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                Nova Mesa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Nova Mesa</DialogTitle>
              </DialogHeader>
              <div className='grid gap-4 py-4'>
                <div className='grid gap-2'>
                  <Label htmlFor='numMesa'>Número da Mesa</Label>
                  <Input
                    id='numMesa'
                    value={formData.numMesa}
                    onChange={(e) =>
                      setFormData({ ...formData, numMesa: e.target.value })
                    }
                  />
                </div>
                <div className='grid gap-2'>
                  <Label htmlFor='numMaxPax'>Capacidade Máxima</Label>
                  <Input
                    id='numMaxPax'
                    type='number'
                    value={formData.numMaxPax}
                    onChange={(e) =>
                      setFormData({ ...formData, numMaxPax: e.target.value })
                    }
                  />
                </div>
                <Button onClick={handleCreate}>Criar Mesa</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div>Carregando...</div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {mesas.map((mesa) => (
              <div
                key={`${mesa.num_cnpj}-${mesa.numMesa}`}
                className='bg-white p-4 rounded-lg shadow'
              >
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='font-semibold'>Mesa {mesa.numMesa}</h3>
                  <div className='flex gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleView(mesa)}
                    >
                      <Eye className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleEditClick(mesa)}
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDelete(mesa)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
                <p>Capacidade: {mesa.numMaxPax} pessoas</p>
                <p>Status: {mesa.is_ativo ? 'Ativa' : 'Inativa'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Dialog de Visualização */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Detalhes da Mesa</DialogTitle>
            </DialogHeader>
            {selectedMesa && (
              <div className='grid gap-4 py-4'>
                <div>
                  <h4 className='font-semibold'>Número da Mesa</h4>
                  <p>{selectedMesa.numMesa}</p>
                </div>
                <div>
                  <h4 className='font-semibold'>Capacidade Máxima</h4>
                  <p>{selectedMesa.numMaxPax} pessoas</p>
                </div>
                <div>
                  <h4 className='font-semibold'>Status</h4>
                  <p>{selectedMesa.is_ativo ? 'Ativa' : 'Inativa'}</p>
                </div>
                <div>
                  <h4 className='font-semibold'>Data de Criação</h4>
                  <p>
                    {new Date(selectedMesa.data_criacao).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h4 className='font-semibold'>Última Atualização</h4>
                  <p>
                    {new Date(
                      selectedMesa.data_atualizacao,
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog de Edição */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Mesa</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='editNumMesa'>Número da Mesa</Label>
                <Input
                  id='editNumMesa'
                  value={formData.numMesa}
                  onChange={(e) =>
                    setFormData({ ...formData, numMesa: e.target.value })
                  }
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='editNumMaxPax'>Capacidade Máxima</Label>
                <Input
                  id='editNumMaxPax'
                  type='number'
                  value={formData.numMaxPax}
                  onChange={(e) =>
                    setFormData({ ...formData, numMaxPax: e.target.value })
                  }
                />
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='editIsAtivo'
                  checked={formData.is_ativo}
                  onChange={(e) =>
                    setFormData({ ...formData, is_ativo: e.target.checked })
                  }
                />
                <Label htmlFor='editIsAtivo'>Mesa Ativa</Label>
              </div>
              <Button onClick={handleEdit}>Salvar Alterações</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </EstablishmentLayout>
  );
};

export default withAuthEstablishment(ManageTables);

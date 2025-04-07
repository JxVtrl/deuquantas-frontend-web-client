/* eslint-disable react-hooks/exhaustive-deps */
import { api } from '@/lib/axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { withAuthEstablishment } from '@/hoc/withAuth';
import EstablishmentLayout from '@/layout/EstablishmentLayout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { Mesa } from '@/services/api/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';

const TablesManagement: React.FC = () => {
  const { user } = useAuth();
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    numMesa: string;
    numMaxPax: number;
    is_ativo: boolean;
    status: 'disponivel' | 'ocupada';
  }>({
    numMesa: '',
    numMaxPax: 0,
    is_ativo: true,
    status: 'disponivel',
  });
  const [filtros, setFiltros] = useState({
    status: 'todos',
    busca: '',
    ordenacao: 'numero',
  });

  useEffect(() => {
    if (user?.estabelecimento?.num_cnpj) {
      fetchMesas();
    }
  }, [user?.estabelecimento?.num_cnpj]);

  const fetchMesas = async () => {
    try {
      setLoading(true);
      if (user?.estabelecimento?.num_cnpj) {
        const response = await api.get(
          `/mesas/estabelecimento/${user.estabelecimento.num_cnpj}`,
        );
        setMesas(response.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar mesas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post('/mesas', {
        ...formData,
        num_cnpj: user?.estabelecimento?.num_cnpj,
      });
      toast.success('Mesa criada com sucesso');
      setIsCreateDialogOpen(false);
      fetchMesas();
    } catch (error: unknown) {
      console.error('Erro ao criar mesa:', error);
      if (error instanceof Error && error.message.includes('mesa já existe')) {
        toast.error('Já existe uma mesa com este número');
      } else {
        toast.error('Erro ao criar mesa');
      }
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
    setFormData({
      numMesa: mesa.numMesa,
      numMaxPax: mesa.numMaxPax,
      is_ativo: mesa.is_ativo,
      status: mesa.status,
    });
    setIsEditDialogOpen(true);
  };

  const handleEdit = async () => {
    try {
      await api.put(`/mesas/${formData.numMesa}`, {
        ...formData,
        num_cnpj: user?.estabelecimento?.num_cnpj,
      });
      toast.success('Mesa atualizada com sucesso');
      setIsEditDialogOpen(false);
      fetchMesas();
    } catch (error: unknown) {
      console.error('Erro ao editar mesa:', error);
      toast.error('Erro ao editar mesa');
    }
  };

  const handleDownloadQrCode = () => {
    if (!selectedMesa) return;

    const qrCodeElement = document.getElementById('qr-code-modal');
    if (qrCodeElement) {
      const svg = qrCodeElement.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `qr-code-mesa-${selectedMesa.numMesa}.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }
  };

  const mesasFiltradas = mesas
    .filter((mesa) => {
      if (filtros.status !== 'todos' && mesa.status !== filtros.status) {
        return false;
      }
      if (filtros.busca) {
        const busca = filtros.busca.toLowerCase();
        return mesa.numMesa.toLowerCase().includes(busca);
      }
      return true;
    })
    .sort((a, b) => {
      switch (filtros.ordenacao) {
        case 'numero':
          return a.numMesa.localeCompare(b.numMesa);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'capacidade':
          return a.numMaxPax - b.numMaxPax;
        default:
          return 0;
      }
    });

  return (
    <EstablishmentLayout>
      <div className='h-[calc(100vh-4rem)] overflow-hidden flex flex-col'>
        <div className='flex justify-between items-center p-6 border-b'>
          <h1 className='text-2xl font-bold'>Gerenciar Mesas</h1>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className='mr-2 h-4 w-4' />
            Nova Mesa
          </Button>
        </div>

        {/* Filtros e Ordenação */}
        <div className='bg-white p-3 border-b'>
          <div className='flex flex-col gap-3'>
            <div className='flex gap-3 items-center'>
              <div className='w-full'>
                <Select
                  value={filtros.status}
                  onValueChange={(value) =>
                    setFiltros({ ...filtros, status: value })
                  }
                >
                  <SelectTrigger className='h-8'>
                    <SelectValue placeholder='Status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='todos'>Todos</SelectItem>
                    <SelectItem value='disponivel'>Disponíveis</SelectItem>
                    <SelectItem value='ocupada'>Ocupadas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='w-full'>
                <Select
                  value={filtros.ordenacao}
                  onValueChange={(value) =>
                    setFiltros({ ...filtros, ordenacao: value })
                  }
                >
                  <SelectTrigger className='h-8'>
                    <SelectValue placeholder='Ordenar por' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='numero'>Número</SelectItem>
                    <SelectItem value='status'>Status</SelectItem>
                    <SelectItem value='capacidade'>Capacidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='w-full'>
              <Input
                id='busca'
                placeholder='Buscar mesa por número'
                value={filtros.busca}
                onChange={(e) =>
                  setFiltros({ ...filtros, busca: e.target.value })
                }
                className='h-8'
              />
            </div>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto p-6'>
          {loading ? (
            <div className='flex justify-center items-center h-full'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFCC00]'></div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {mesasFiltradas.map((mesa) => (
                <div
                  key={mesa.numMesa}
                  className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'
                >
                  <div className='flex justify-between items-start mb-4'>
                    <div>
                      <h3 className='text-lg font-semibold'>
                        Mesa {mesa.numMesa}
                      </h3>
                      <p className='text-sm text-gray-500'>
                        Capacidade: {mesa.numMaxPax} pessoas
                      </p>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleEditClick(mesa)}
                        title='Editar mesa'
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleDelete(mesa)}
                        title='Excluir mesa'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => handleView(mesa)}
                        title='Ver QR Code'
                      >
                        <Eye className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          mesa.status === 'disponivel'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      />
                      <span className='text-sm font-medium'>
                        {mesa.status === 'disponivel'
                          ? 'Disponível'
                          : 'Ocupada'}
                      </span>
                    </div>
                    <div className='text-sm text-gray-500'>
                      Criada em:{' '}
                      {new Date(mesa.data_criacao).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
                  {new Date(selectedMesa.data_atualizacao).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold'>Editar Mesa</DialogTitle>
            <DialogDescription>
              Atualize os dados da mesa selecionada
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-6 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='editNumMesa' className='text-sm font-medium'>
                Número da Mesa
              </Label>
              <Input
                id='editNumMesa'
                placeholder='Ex: 1, 2, 3...'
                value={formData.numMesa}
                onChange={(e) =>
                  setFormData({ ...formData, numMesa: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='editNumMaxPax' className='text-sm font-medium'>
                Capacidade Máxima
              </Label>
              <Input
                id='editNumMaxPax'
                type='number'
                min='1'
                placeholder='Ex: 4, 6, 8...'
                value={formData.numMaxPax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numMaxPax: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='editStatus' className='text-sm font-medium'>
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as 'disponivel' | 'ocupada',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Selecione o status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='disponivel'>Disponível</SelectItem>
                  <SelectItem value='ocupada'>Ocupada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleEdit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>QR Code da Mesa {selectedMesa?.numMesa}</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col items-center gap-4'>
            <div id='qr-code-modal' className='flex justify-center'>
              {selectedMesa && (
                <QRCodeSVG
                  value={selectedMesa.qrCode}
                  size={200}
                  level='H'
                  includeMargin
                />
              )}
            </div>
            <Button
              onClick={handleDownloadQrCode}
              className='bg-[#FFCC00] text-black hover:bg-[#FFCC00]/80'
            >
              Baixar QR Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle className='text-xl font-bold'>
              Criar Nova Mesa
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da nova mesa abaixo
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-6 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='numMesa' className='text-sm font-medium'>
                Número da Mesa
              </Label>
              <Input
                id='numMesa'
                placeholder='Ex: 1, 2, 3...'
                value={formData.numMesa}
                onChange={(e) =>
                  setFormData({ ...formData, numMesa: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='numMaxPax' className='text-sm font-medium'>
                Capacidade Máxima
              </Label>
              <Input
                id='numMaxPax'
                type='number'
                min='1'
                placeholder='Ex: 4, 6, 8...'
                value={formData.numMaxPax}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numMaxPax: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreate}>Criar Mesa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </EstablishmentLayout>
  );
};

export default withAuthEstablishment(TablesManagement);

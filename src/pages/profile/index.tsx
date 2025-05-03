import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { withAuthCustomer } from '@/hoc/withAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Layout from '@/layout';
import SeoHead from '@/components/SeoHead';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';
import { api } from '@/lib/axios';

const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) return;

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await api.post(
        `/clientes/${user?.cliente?.id}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data) {
        // Atualiza o avatar no estado do usuário
        if (user && user.cliente) {
          setUser({
            ...user,
            cliente: {
              ...user.cliente,
              avatar: `${process.env.NEXT_PUBLIC_API_URL}/uploads/${response.data.avatar}`,
            },
          });
        }

        // Limpa o preview e a imagem selecionada
        setImagePreview(null);
        setSelectedImage(null);

        toast({
          title: 'Sucesso',
          description: 'Foto de perfil atualizada com sucesso!',
        });
      }
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a foto de perfil.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <SeoHead title='Perfil - DeuQuantas' />
      <Layout>
        <div className='max-w-4xl mx-auto p-6 overflow-y-scroll h-[calc(100vh-120px)]'>
          <h1 className='text-2xl font-bold mb-6'>Meu Perfil</h1>

          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col items-center space-y-4'>
                <div className='relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200'>
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt='Preview'
                      fill
                      className='object-cover'
                    />
                  ) : user?.cliente?.avatar ? (
                    <Image
                      src={user.cliente.avatar}
                      alt='Avatar'
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className='w-full h-full bg-gray-100 flex items-center justify-center'>
                      <Upload className='h-8 w-8 text-gray-400' />
                    </div>
                  )}
                </div>
                <div className='flex flex-col items-center space-y-2'>
                  <label
                    htmlFor='avatar-upload'
                    className='cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md'
                  >
                    Escolher foto
                    <input
                      id='avatar-upload'
                      type='file'
                      className='hidden'
                      accept='image/*'
                      onChange={handleImageChange}
                    />
                  </label>
                  {selectedImage && (
                    <Button onClick={handleImageUpload}>Salvar foto</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Dados Pessoais</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h3 className='font-medium'>Email</h3>
                <p className='text-sm text-gray-500'>{user?.usuario?.email}</p>
              </div>

              <Separator />

              <div>
                <h3 className='font-medium'>Nome</h3>
                <p className='text-sm text-gray-500'>{user?.usuario?.name}</p>
              </div>

              <Separator />

              <div>
                <h3 className='font-medium'>Telefone</h3>
                <p className='text-sm text-gray-500'>
                  {user?.cliente?.num_celular}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className='font-medium'>Data de Nascimento</h3>
                <p className='text-sm text-gray-500'>
                  {user?.cliente?.data_nascimento
                    ? new Date(user?.cliente?.data_nascimento).toLocaleDateString(
                      'pt-BR',
                    )
                    : 'Não informado'}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className='font-medium'>CPF</h3>
                <p className='text-sm text-gray-500'>
                  {user?.cliente?.num_cpf}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className='mb-6'>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <h3 className='font-medium'>Endereço</h3>
                <p className='text-sm text-gray-500'>
                  {user?.endereco?.endereco}, {user?.endereco?.numero}
                  {user?.endereco?.complemento &&
                    ` - ${user?.endereco?.complemento}`}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className='font-medium'>Bairro</h3>
                <p className='text-sm text-gray-500'>
                  {user?.endereco?.bairro}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className='font-medium'>Cidade/Estado</h3>
                <p className='text-sm text-gray-500'>
                  {user?.endereco?.cidade} - {user?.endereco?.estado}
                </p>
              </div>

              <Separator />

              <div>
                <h3 className='font-medium'>CEP</h3>
                <p className='text-sm text-gray-500'>{user?.endereco?.cep}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </>
  );
};

export default withAuthCustomer(ProfilePage);

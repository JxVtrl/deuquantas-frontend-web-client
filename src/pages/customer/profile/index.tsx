import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { withAuthCustomer } from '@/hoc/withAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CustomerLayout } from '@/layout';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <CustomerLayout>
      <div className='max-w-4xl mx-auto p-6 overflow-y-scroll h-[calc(100vh-120px)]'>
        <h1 className='text-2xl font-bold mb-6'>Meu Perfil</h1>

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
              <p className='text-sm text-gray-500'>{user?.endereco?.bairro}</p>
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
    </CustomerLayout>
  );
};

export default withAuthCustomer(ProfilePage);

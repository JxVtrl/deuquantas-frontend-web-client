import { withAuthCustomer } from '@/hoc/withAuth';
import { CustomerLayout } from '@/layout';
import React from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { IOSSwitch } from '@/components/ui/ios-switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const Configuração: React.FC = () => {
  const { preferences, toggleLeftHanded, toggleLanguage } =
    useUserPreferences();

  return (
    <CustomerLayout>
      <div className='max-w-4xl mx-auto p-6 overflow-y-scroll h-[calc(100vh-120px)]'>
        <h1 className='text-2xl font-bold mb-6'>Configurações</h1>

        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Preferências de Interface</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium'>Modo Canhoto</h3>
                <p className='text-sm text-gray-500'>
                  Posiciona o botão de adicionar à esquerda
                </p>
              </div>
              <IOSSwitch
                checked={preferences.isLeftHanded}
                onChange={() => toggleLeftHanded()}
              />
            </div>

            <Separator />

            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium'>Idioma</h3>
                <p className='text-sm text-gray-500'>
                  Altera o idioma da aplicação
                </p>
              </div>
              <Button variant='outline' onClick={() => toggleLanguage()}>
                {preferences.language === 'pt' ? 'Português' : 'English'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
};

export default withAuthCustomer(Configuração);

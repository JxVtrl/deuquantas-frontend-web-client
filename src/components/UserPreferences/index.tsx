import React from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const UserPreferences: React.FC = () => {
  const { preferences, toggleLeftHanded } = useUserPreferences();
  const { isLeftHanded } = preferences;

  return (
    <div className='flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm'>
      <h3 className='text-lg font-semibold'>Preferências do Usuário</h3>

      <div className='flex items-center justify-between'>
        <div className='space-y-0.5'>
          <Label htmlFor='left-handed'>Modo Canhoto</Label>
          <p className='text-sm text-gray-500'>
            Posiciona o botão de adicionar à esquerda na navegação inferior
          </p>
        </div>
        <Switch
          id='left-handed'
          checked={isLeftHanded}
          onCheckedChange={toggleLeftHanded}
        />
      </div>
    </div>
  );
};

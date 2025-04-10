import React, {
  createContext,
  useContext,
  useState,
  //useEffect
} from 'react';
// import { useAuth } from './AuthContext';
import { UserPreferences } from '@/services/api/types';
import { api } from '@/lib/axios';

export type AvailableLanguages = 'pt' | 'en';

interface UserPreferencesContextType {
  preferences: UserPreferences;
  toggleLeftHanded: () => void;
  toggleLanguage: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType>(
  {} as UserPreferencesContextType,
);

export const UserPreferencesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    isLeftHanded: false,
    language: 'pt',
  });

  const updatePreferences = async (
    newPreferences: Partial<UserPreferences>,
  ) => {
    try {
      await api.put('/api/proxy/preferencias', newPreferences);
      setPreferences((prev: UserPreferences) => ({
        ...prev,
        ...newPreferences,
      }));
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
    }
  };

  const toggleLeftHanded = () => {
    updatePreferences({ isLeftHanded: !preferences.isLeftHanded });
  };

  const toggleLanguage = () => {
    updatePreferences({
      language: preferences.language === 'pt' ? 'en' : 'pt',
    });
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        toggleLeftHanded,
        toggleLanguage,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error(
      'useUserPreferences deve ser usado dentro de um UserPreferencesProvider',
    );
  }
  return context;
};

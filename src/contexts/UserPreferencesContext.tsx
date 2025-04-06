import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import Cookies from 'js-cookie';

export type AvailableLanguages = 'pt' | 'en';

interface UserPreferences {
  isLeftHanded: boolean;
  language: AvailableLanguages;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  toggleLeftHanded: () => void;
  toggleLanguage: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType>(
  {} as UserPreferencesContextType,
);

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    isLeftHanded: false,
    language: 'pt',
  });

  useEffect(() => {
    // Carregar preferências do cookie
    const savedPreferences = Cookies.get('userPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  useEffect(() => {
    // Salvar preferências no cookie
    Cookies.set('userPreferences', JSON.stringify(preferences), {
      expires: 365, // 1 ano
    });
  }, [preferences]);

  const toggleLeftHanded = () => {
    setPreferences((prev) => ({
      ...prev,
      isLeftHanded: !prev.isLeftHanded,
    }));
  };

  const toggleLanguage = () => {
    setPreferences((prev) => ({
      ...prev,
      language: prev.language === 'pt' ? 'en' : 'pt',
    }));
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

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface UserPreferences {
  isLeftHanded: boolean;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  toggleLeftHanded: () => void;
}

const UserPreferencesContext = createContext<
  UserPreferencesContextType | undefined
>(undefined);

export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    // Tenta recuperar as preferências do localStorage
    if (typeof window !== 'undefined') {
      const savedPreferences = localStorage.getItem('userPreferences');
      if (savedPreferences) {
        return JSON.parse(savedPreferences);
      }
    }
    // Valores padrão
    return { isLeftHanded: false };
  });

  // Salva as preferências no localStorage quando mudam
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
  }, [preferences]);

  const toggleLeftHanded = () => {
    setPreferences((prev) => ({
      ...prev,
      isLeftHanded: !prev.isLeftHanded,
    }));
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, toggleLeftHanded }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error(
      'useUserPreferences must be used within a UserPreferencesProvider',
    );
  }
  return context;
};

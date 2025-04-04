import React, { createContext, ReactNode, useContext } from 'react';
import { useAuthForm } from '@/hooks/useAuthForm';
import { LoginData, RegisterData } from '@/services/auth.service';

interface AuthFormContextData {
  loading: boolean;
  error: string | null;
  isLogin: boolean;
  isRegisterAsEstablishment: boolean;
  toggleForm: () => void;
  toggleRegisterAsEstablishment: () => void;
  setRegisterType: (type: 'cliente' | 'estabelecimento') => void;
  handleSubmit: (data: LoginData | RegisterData) => Promise<void>;
}

interface AuthFormProviderProps {
  children: ReactNode;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  onSuccess: () => void;
}

const AuthFormContext = createContext<AuthFormContextData>(
  {} as AuthFormContextData,
);

export function AuthFormProvider({
  children,
  login,
  register,
  onSuccess,
}: AuthFormProviderProps) {
  const authForm = useAuthForm({ login, register, onSuccess });

  return (
    <AuthFormContext.Provider value={authForm}>
      {children}
    </AuthFormContext.Provider>
  );
}

export function useAuthFormContext() {
  const context = useContext(AuthFormContext);
  if (!context) {
    throw new Error(
      'useAuthFormContext deve ser usado dentro de um AuthFormProvider',
    );
  }
  return context;
}

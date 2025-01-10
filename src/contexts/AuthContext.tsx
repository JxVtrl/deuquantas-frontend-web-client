import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { PermissionLevel, User } from "../../services/api/types";

export type AvailableLanguages = "pt" | "en";
export type AvailableThemes = "dark" | "light" | "system";

interface AuthContextData {
  signed: boolean;
  user?: User;
  logout: () => void;
  login: (email: string, password: string) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useState<User | undefined>(undefined);

  const isAdmin = useMemo(
    () => user?.permission_level === PermissionLevel.Admin,
    [user?.permission_level]
  );

  const logout = () => {};
  const login = () => {};

  return (
    <AuthContext.Provider
      value={{
        signed: Boolean(user),
        user,
        isAdmin,
        logout,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used under AuthProvider");
  }

  return context;
};

export default AuthContext;

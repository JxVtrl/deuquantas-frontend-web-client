import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { PermissionLevel, User } from "../../services/api/types";
import { setDefaultHeaderToken } from "../../services/api";
import storage from "../../services/storage/storage";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";
import { saveUserPreferences, viewUserPreferences } from "../../services/user";
import { login, logout } from "../../services/sessions";
export type AvailableLanguages = "pt" | "en";
export type AvailableThemes = "dark" | "light" | "system";

interface AuthContextData {
  signed: boolean;
  user?: User;
  logout: () => void;
  handleLogout: () => void;
  login: (code: string, state: string, session_state: string) => Promise<void>;
  isAdmin: boolean;
  processLogin: (token: string) => void;
  storeUserPreferences: (
    theme: AvailableThemes,
    language: AvailableLanguages
  ) => void;
  clearSession: (msg: string) => void;
  getUserPreferences: () => void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [, setError] = useState<string>("");
  const [theme, setTheme] = useState<AvailableThemes>("dark");
  const [language, setLanguage] = useState<AvailableLanguages>("pt");
  const router = useRouter();

  const isAdmin = useMemo(
    () => user?.permission_level === PermissionLevel.Admin,
    [user?.permission_level]
  );

  const handleLogin = async (code: string, _: string, sessionState: string) => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const redirect_url_path = "/auth/callback";
      const res = await login(code, sessionState, redirect_url_path);

      await processLogin(res.data);
    } catch (err: any) {
      setError("There was an error logging in. Please try again.");
      setUser(undefined);
      router.replace("/login");
    }
  };

  const processLogin = async (token: string) => {
    if (typeof window === "undefined") {
      // Evita que o código execute no lado do servidor
      return;
    }

    try {
      const user = jwtDecode(token) as User;
      setDefaultHeaderToken(token);
      setUser(user);
      storage.setItem("deuquantas_token", token);

      await getUserPreferences();

      const pageBeforeLogin = router.query.state;
      if (pageBeforeLogin) {
        router.back();
      } else {
        router.replace("/");
      }
    } catch (error) {
      console.error("Erro durante o processamento do login:", error);
      setUser(undefined);
    }
  };

  const storeUserPreferences = (
    theme: AvailableThemes,
    language: AvailableLanguages
  ) => {
    setTheme(theme);
    setLanguage(language);
  };

  const getUserPreferences = async () => {
    try {
      const userPreferences = await viewUserPreferences();
      storeUserPreferences(userPreferences.theme, userPreferences.language);
    } catch (err: any) {
      console.warn("Error getting user preferences.");
      if (err.response?.status === 404) {
        try {
          const userPreferences = await saveUserPreferences(theme, language);
          storeUserPreferences(userPreferences.theme, userPreferences.language);
        } catch {
          console.warn("Error saving user preferences.");
        }
      }
    }
  };

  const handleLogout = async () => {
    logout().finally(() => {
      setError("");
      setUser(undefined);
      router.replace("/login");
    });
  };

  const clearSession = (msg: string) => {
    setUser(undefined);
    setError(msg);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        signed: Boolean(user),
        user,
        isAdmin,
        logout,
        login: handleLogin,
        handleLogout,
        clearSession,
        getUserPreferences,
        storeUserPreferences,
        processLogin,
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

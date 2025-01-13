import { useRouter } from "next/router";
import { useEffect } from "react";

export function withAuthAdmin(Component: React.FC) {
  return withAuth(Component, "admin");
}

export function withAuth(Component: React.FC, requiredRole?: string) {
  return function AuthenticatedComponent(
    props: React.ComponentProps<typeof Component>
  ) {
    const router = useRouter();
    const user = getUserFromLocalStorage(); // Simulação de autenticação

    useEffect(() => {
      if (!user) {
        router.replace("/login");
      } else if (requiredRole && user.role !== requiredRole) {
        router.replace("/unauthorized");
      }
    }, [user, router]);

    if (!user || (requiredRole && user.role !== requiredRole)) {
      return null; // Renderiza nada até redirecionar
    }

    return <Component {...props} />;
  };
}

// Simulação de recuperação do usuário
function getUserFromLocalStorage() {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('deuquantas_token');
    return token ? JSON.parse(atob(token.split('.')[1])) : null;
  }
  return null;
}

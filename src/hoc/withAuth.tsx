import { useRouter } from "next/router";
import { useEffect } from "react";

export function withAuthAdmin(Component: React.FC) {
  return withAuth(Component, "admin");
}

export function withAuthEstablishment(Component: React.FC) {
  return withAuth(Component, "establishment");
}

export function withAuthCustomer(Component: React.FC) {
  return withAuth(Component, "customer");
}

export function withAuth(Component: React.FC, requiredRole?: string) {
  return function AuthenticatedComponent(
    props: React.ComponentProps<typeof Component>
  ) {

    return <Component {...props} />; // TODO: REMOVER

    const router = useRouter();
    const user = getUserFromLocalStorage(); // Simulação de autenticação
    console.log(user);


    useEffect(() => {
      if (!user) {
        router.replace("/customer/login");
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

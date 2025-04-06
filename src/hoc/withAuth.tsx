import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function withAuthAdmin(Component: React.FC) {
  return withAuth(Component, 'admin');
}

export function withAuthEstablishment(Component: React.FC) {
  return withAuth(Component, 'establishment');
}

export function withAuthCustomer(Component: React.FC) {
  return withAuth(Component, 'customer');
}

export function withAuth(Component: React.FC, requiredRole?: string) {
  return function AuthenticatedComponent(
    props: React.ComponentProps<typeof Component>,
  ) {
    const router = useRouter();
    const { user, isAuthenticated, loading } = useAuth();

    useEffect(() => {
      // Se ainda está carregando, não faz nada
      if (loading) {
        return;
      }

      // Se não estiver autenticado, redireciona para /login
      if (!isAuthenticated || !user) {
        router.replace('/login');
        return;
      }

      // Se tiver uma role específica, verifica a permissão
      if (requiredRole) {
        const requiredLevel = getPermissionLevel(requiredRole);
        const userLevel = user.usuario.permission_level || 3; // Default para customer

        if (userLevel !== requiredLevel) {
          router.replace('/login');
          return;
        }
      }
    }, [user, isAuthenticated, loading, router]);

    // Se ainda está carregando, mostra nada
    if (loading) {
      return null;
    }

    // Renderiza o componente apenas se o usuário estiver autenticado e tiver as permissões necessárias
    if (
      !isAuthenticated ||
      !user ||
      (requiredRole &&
        user.usuario.permission_level !== getPermissionLevel(requiredRole))
    ) {
      return null;
    }

    return <Component {...props} />;
  };
}

// Função para obter o nível de permissão com base no papel
function getPermissionLevel(role: string): number {
  switch (role) {
    case 'admin':
      return 1;
    case 'establishment':
      return 2;
    case 'customer':
      return 3;
    default:
      return 0;
  }
}

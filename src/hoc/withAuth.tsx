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
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
      const checkAuth = async () => {
        console.log('Verificando autenticação...');
        console.log('Usuário:', user);
        console.log('Está autenticado:', isAuthenticated);

        if (!isAuthenticated || !user) {
          console.log('Usuário não autenticado, redirecionando para /auth');
          await router.replace('/auth');
          return;
        }

        if (requiredRole) {
          const requiredLevel = getPermissionLevel(requiredRole);
          const userLevel = user.permission_level || 3; // Default para customer

          console.log('Nível de permissão requerido:', requiredLevel);
          console.log('Nível de permissão do usuário:', userLevel);

          if (userLevel !== requiredLevel) {
            console.log(
              `Permissão insuficiente. Usuário tem nível ${userLevel}, mas precisa de ${requiredLevel}`,
            );
            await router.replace('/auth');
            return;
          }
        }

        console.log('Autenticação verificada com sucesso!');
      };

      checkAuth();
    }, [user, isAuthenticated, router]);

    // Renderiza o componente apenas se o usuário estiver autenticado e tiver as permissões necessárias
    if (
      !isAuthenticated ||
      !user ||
      (requiredRole &&
        user.permission_level !== getPermissionLevel(requiredRole))
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

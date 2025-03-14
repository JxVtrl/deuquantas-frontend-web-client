import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Interface para o payload do token JWT com o nível de permissão
interface UserPayload extends JwtPayload {
  permission_level?: number;
}

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
    const user = getUserFromToken(); // Usa o token JWT real

    useEffect(() => {
      if (!user) {
        router.replace('/auth/login');
      } else if (
        requiredRole &&
        user.permission_level !== getPermissionLevel(requiredRole)
      ) {
        router.replace('/unauthorized');
      }
    }, [user, router]);

    if (
      !user ||
      (requiredRole &&
        user.permission_level !== getPermissionLevel(requiredRole))
    ) {
      return null; // Renderiza nada até redirecionar
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

// Função para obter o usuário a partir do token JWT
function getUserFromToken(): UserPayload | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;

    try {
      return jwtDecode<UserPayload>(token);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      localStorage.removeItem('auth_token');
      return null;
    }
  }
  return null;
}

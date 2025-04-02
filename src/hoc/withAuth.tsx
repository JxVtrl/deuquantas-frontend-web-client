import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Interface para o payload do token JWT com o nível de permissão
interface UserPayload extends JwtPayload {
  permission_level?: number;
  isAdmin?: boolean;
  email?: string;
  nome?: string;
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
      console.log('User data:', user);
      console.log('Required role:', requiredRole);

      if (requiredRole) {
        console.log(
          'Required permission level:',
          getPermissionLevel(requiredRole),
        );
      }

      if (!user) {
        console.log('Usuário não autenticado, redirecionando para login');
        router.replace('/login');
      } else if (
        requiredRole &&
        user.permission_level !== getPermissionLevel(requiredRole)
      ) {
        console.log(
          `Permissão insuficiente. Usuário tem nível ${user.permission_level}, mas precisa de ${getPermissionLevel(requiredRole)}`,
        );
        router.replace('/login');
      }
    }, [user, router]);

    // if (
    //   !user ||
    //   (requiredRole &&
    //     user.permission_level !== getPermissionLevel(requiredRole))
    // ) {
    //   return null; // Renderiza nada até redirecionar
    // }

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
      const decoded = jwtDecode<UserPayload>(token);
      console.log('Token decodificado:', decoded);
      return decoded;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      localStorage.removeItem('auth_token');
      return null;
    }
  }
  return null;
}

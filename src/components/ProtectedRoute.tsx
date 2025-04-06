import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  adminOnly = false,
}) => {
  const { isAuthenticated, is_admin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Redireciona para a página de login se não estiver autenticado
        router.push({
          pathname: '/login',
          query: { state: router.asPath }, // Salva a página atual para redirecionar após o login
        });
      } else if (adminOnly && !is_admin) {
        // Redireciona para a página inicial se não for admin e a rota for apenas para admins
        router.push('/');
      }
    }
  }, [isAuthenticated, is_admin, loading, router, adminOnly]);

  // Mostra nada enquanto verifica a autenticação
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  // Se não estiver autenticado ou se for uma rota de admin e o usuário não for admin, não mostra nada
  if (!isAuthenticated || (adminOnly && !is_admin)) {
    return null;
  }

  // Se estiver autenticado e tiver as permissões necessárias, mostra o conteúdo
  return <>{children}</>;
};

export default ProtectedRoute;

import { auth } from '@/config/firebase/firebase'; // Certifique-se de que o caminho está correto
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Usuário deslogado com sucesso!');
      router.replace('/customer/login');
      // Redirecionar para a tela de login, se necessário
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className='bg-red-500 text-white px-4 py-2 rounded'
    >
      Sair
    </button>
  );
};

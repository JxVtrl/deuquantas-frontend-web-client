import { useAuth } from '@/contexts/AuthContext';
import {
  customerBottomNavigation,
  establishmentBottomNavigation,
} from '@/data/bottom_navigation';
import { customerActions } from '@/data/home_actions';
import { establishmentActions } from '@/data/home_actions';
import {
  customerNavigationPills,
  establishmentNavigationPills,
} from '@/data/home_navigation_pills';

export const useNavigation = () => {
  const { user } = useAuth();

  const navigationPills = user?.estabelecimento
    ? establishmentNavigationPills
    : customerNavigationPills;

  const actionItems = !!user?.estabelecimento
    ? establishmentActions
    : customerActions;

  // Organiza os itens com base na preferência do usuário
  const bottomNavItems = !!user?.estabelecimento
    ? establishmentBottomNavigation
    : customerBottomNavigation;

  const handleAddClick = () => {
    // Implement add functionality
    console.log('Add clicked');
  };

  return {
    navigationPills,
    actionItems,
    bottomNavItems,
    handleAddClick,
  };
};

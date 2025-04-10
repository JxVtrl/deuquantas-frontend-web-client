import { customerBottomNavigation } from '@/data/bottom_navigation';
import { customerActions } from '@/data/home_actions';
import { customerNavigationPills } from '@/data/home_navigation_pills';

export const useNavigation = () => {
  const navigationPills = customerNavigationPills;
  const actionItems = customerActions;
  const bottomNavItems = customerBottomNavigation;

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

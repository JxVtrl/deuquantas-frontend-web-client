import { customerBottomNavigation } from '@/data/bottom_navigation';
import { customerActions } from '@/data/home_actions';
import {
  contaNavigationPills,
  customerNavigationPills,
} from '@/data/home_navigation_pills';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useNavigation = () => {
  const [isConta, setIsConta] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsConta(router.pathname.includes('/conta/'));
  }, [router.pathname]);

  const navigationPills = isConta
    ? contaNavigationPills
    : customerNavigationPills;
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

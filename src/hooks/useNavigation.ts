import { bottomNavigation } from '@/data/bottom_navigation';
import { actions } from '@/data/home_actions';
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
  const actionItems = actions;

  const [bottomNavItems, setBottomNavItems] = useState<
    {
      icon: React.FC;
      label: string;
      onClick: () => void;
      isActive: boolean;
      href: string;
    }[]
  >([]);

  const checkNavItems = () => {
    const activeItem = bottomNavigation.find(
      (item) => item.href === router.pathname,
    );
    if (activeItem) {
      setBottomNavItems(
        bottomNavigation.map((item) => ({
          ...item,
          isActive: item.href === router.pathname,
          onClick: () => router.push(item.href),
        })),
      );
    }
  };

  useEffect(() => {
    checkNavItems();
  }, [router.pathname]);

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

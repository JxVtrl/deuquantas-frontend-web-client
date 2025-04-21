import { navigation } from '@/data/navigation';
import { ActionItem, actions } from '@/data/actions';
import {
  contaNavigationPills,
  customerNavigationPills,
} from '@/data/home_navigation_pills';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { menu_items } from '@/data/menu';

export const useNavigation = () => {
  const router = useRouter();

  const [isConta, setIsConta] = useState(false);

  useEffect(() => {
    setIsConta(router.pathname.includes('/conta/'));
  }, [router.pathname]);

  const [bottomNavItems, setBottomNavItems] = useState<
    {
      icon: React.FC;
      label: string;
      onClick: () => void;
      isActive: boolean;
      href: string;
    }[]
  >([]);

  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  const navigationPills = isConta
    ? contaNavigationPills
    : customerNavigationPills;

  const checkNavItems = () => {
    setBottomNavItems(
      navigation.map((item) => ({
        ...item,
        isActive: item.href === router.pathname,
        onClick: () => router.push(item.href),
      })),
    );
  };

  useEffect(() => {
    checkNavItems();
  }, [router.pathname]);

  const checkActionItems = () => {
    const items = actions.map((item) => ({
      ...item,
      onClick: () => router.push(item.href),
    }));

    setActionItems(items);
  };

  useEffect(() => {
    checkActionItems();
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

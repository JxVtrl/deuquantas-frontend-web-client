import { navigation } from '@/data/navigation';
import { ActionItem, actions } from '@/data/actions';
import {
  contaNavigationPills,
  customerNavigationPills,
  menuNavigationPills,
  NavigationPill,
} from '@/data/home_navigation_pills';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useNavigation = () => {
  const router = useRouter();

  const [isConta, setIsConta] = useState(false);
  const [isMenu, setIsMenu] = useState(false);

  useEffect(() => {
    setIsConta(router.pathname.includes('/conta/'));
    setIsMenu(router.pathname.includes('/conta/menu'));
  }, [router.pathname]);

  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [navigationPills, setNavigationPills] = useState<NavigationPill[]>([]);
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
    setBottomNavItems(
      navigation.map((item) => ({
        ...item,
        isActive: item.href === router.pathname,
        onClick: () => router.push(item.href),
      })),
    );
  };

  const checkActionItems = () => {
    const items = actions.map((item) => ({
      ...item,
      onClick: () => router.push(item.href),
    }));

    setActionItems(items);
  };

  const checkNavPills = () => {
    let list = customerNavigationPills;

    if (isConta) {
      list = contaNavigationPills;

      if (isMenu) {
        list = menuNavigationPills;
      }
    }

    setNavigationPills(list);
  };

  useEffect(() => {
    checkNavPills();
  }, [isConta, isMenu]);

  useEffect(() => {
    checkNavItems();
    checkActionItems();
    checkNavPills();
  }, [router.pathname]);

  const handleAddClick = () => {
    console.log('handleAddClick');
    if (!router.pathname.includes('/conta/menu')) {
      router.push('/conta/menu');
    }

  };

  return {
    navigationPills,
    actionItems,
    bottomNavItems,
    handleAddClick,
  };
};

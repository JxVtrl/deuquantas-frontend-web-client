import { navigation } from '@/data/navigation';
import { ActionItem, actions } from '@/data/actions';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useNavigation = () => {
  const router = useRouter();

  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
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
        isActive: router.pathname.includes(item.href),
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

  useEffect(() => {
    checkNavItems();
    checkActionItems();
  }, [router.pathname]);

  return {
    actionItems,
    bottomNavItems,
  };
};

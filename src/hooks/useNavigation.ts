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
import { useComanda } from '@/contexts/ComandaContext';
import { MenuService } from '@/services/menu.service';
import { capitalize } from '@/utils/formatters';

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


  const getMenu = async (cnpj: string) => {
    try {
      const itens = await MenuService.getItensByEstabelecimento(cnpj);
      return itens;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const checkNavPills = async () => {
    let list = customerNavigationPills;

    if (isConta) {
      list = contaNavigationPills;

      if (isMenu) {
        const itens = await getMenu(comanda?.num_cnpj || '');
        const tipos = itens.map((item) => item.tipo);
        const tiposUnicos = Array.from(new Set(tipos));
        list = tiposUnicos.map((tipo) => ({
          label: capitalize(tipo),
          onClick: () => {
            router.push(`/conta/menu?tipo=${tipo}`);
          },
        }));
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

  const { comanda } = useComanda();

  const handleAddClick = () => {
    // se ele não estiver na comanda e existir uma comanda ativa, ele vai para a comanda
    if (!router.pathname.includes('/conta/menu') && !!comanda) {
      router.push('/conta/menu');
    }

    // se nao exisir uma comanda ativa, ele vai para o qr code
    if (!comanda) {
      router.push('/qr-code');
    }
  };

  return {
    navigationPills,
    actionItems,
    bottomNavItems,
    handleAddClick,
  };
};

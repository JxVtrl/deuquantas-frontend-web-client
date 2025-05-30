import React, { useEffect, useState } from 'react';
import { withAuthCustomer } from '@/hoc/withAuth';
import Layout from '@/layout';
import { NavigationPills } from '@/components/NavigationPills';
import { useComanda } from '@/contexts/ComandaContext';
import { Item } from '@/services/menu.service';
import Image from 'next/image';
import { MaxWidthWrapper } from '@deuquantas/components';
import { capitalize, currencyFormatter } from '@/utils/formatters';
import { CartDrawer } from '@/components/CartDrawer';
import { NavigationPill } from '@/data/home_navigation_pills';
import SeoHead from '@/components/SeoHead';
const MenuDaConta: React.FC = () => {
  const {
    setSelectedItem,
    clearCart,
    setItensInCart,
    tipo,
    menu,
    getMenu,
    estabelecimento,
    setTipo,
  } = useComanda();
  const [filteredMenu, setFilteredMenu] = useState<Item[]>([]);

  useEffect(() => {
    clearCart();
    if (estabelecimento?.num_cnpj) {
      getMenu(estabelecimento?.num_cnpj);
    }
  }, []);

  const filterMenu = (menuList: Item[]) => {
    if (tipo) {
      return menuList.filter(
        (item) => item.tipo.toLowerCase() === tipo.toLowerCase(),
      );
    }
    return menuList;
  };

  useEffect(() => {
    setFilteredMenu(filterMenu(menu));
  }, [menu, tipo]);

  const [navigationPills, setNavigationPills] = useState<NavigationPill[]>([]);

  useEffect(() => {
    const tipos = menu.map((item) => item.tipo);
    const tiposUnicos = Array.from(new Set(tipos));
    const list = tiposUnicos.map((type) => {
      return {
        label: capitalize(type || ''),
        isActive: type === tipo,
        onClick: () => {
          if (type === tipo) {
            setTipo(null);
          } else {
            setTipo(type);
          }
        },
      };
    });

    setNavigationPills(list);
  }, []);

  return (
    <>
      <SeoHead title='Menu - DeuQuantas' />
      <Layout>
        <NavigationPills navigationPills={navigationPills} hasArrowBack />

        <MaxWidthWrapper style={{ paddingBottom: '96px' }}>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-[16px] gap-y-[12px] p-[10px]'>
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className='flex flex-col rounded-[8px] bg-[#F5F5F5] shadow-[0px_4px_4px_0px_#00000040] w-full cursor-pointer'
                onClick={() => {
                  setSelectedItem(item);
                  setItensInCart([
                    {
                      ...item,
                      quantidade: 1,
                    },
                  ] as Item[] extends {
                    quantidade: number;
                  }
                    ? Item[]
                    : never);
                }}
              >
                <div
                  className='relative w-full'
                  style={{
                    aspectRatio: 1.09,
                  }}
                >
                  <Image
                    src={item.img}
                    alt={item.nome}
                    layout='fill'
                    objectFit='cover'
                  />
                </div>
                <div className='flex flex-col gap-y-[4px] p-[4px]'>
                  <span className='text-[12px] font-[600] leading-[16px] tracking-[0.5px] text-[#000000]'>
                    {capitalize(item.nome || '')}
                  </span>
                  <span className='text-[11px] font-[500] leading-[14px] tracking-[0.5px] text-[#000000]'>
                    {currencyFormatter(item.preco || 0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
        <CartDrawer />
      </Layout>
    </>
  );
};

export default withAuthCustomer(MenuDaConta);

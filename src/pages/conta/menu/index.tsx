import React, { useEffect, useState } from 'react';
import { withAuthCustomer } from '@/hoc/withAuth';
import Layout from '@/layout';
import { NavigationPills } from '@/components/NavigationPills';
import { useComanda } from '@/contexts/ComandaContext';
import { useRouter } from 'next/router';
import { MenuService } from '@/services/menu.service';
import Image from 'next/image';
import { MaxWidthWrapper } from '@deuquantas/components';
import { capitalize, currencyFormatter } from '@/utils/formatters';
import { CartDrawer } from '@/components/CartDrawer';

const MenuDaConta: React.FC = () => {
  const { comanda, setSelectedItem, clearCart, setItensInCart } = useComanda();
  const router = useRouter();
  const [menu, setMenu] = useState<any[]>([]);
  const [tipo, setTipo] = useState<string | null>(null);
  const getMenu = async (cnpj: string) => {
    try {
      const itens = await MenuService.getItensByEstabelecimento(cnpj);
      setMenu(itens);
    } catch (error) {
      console.error(error);
      router.push('/home');
    }
  };

  useEffect(() => {
    clearCart();
  }, []);

  useEffect(() => {
    if (comanda) {
      const estab_cnpj = comanda.num_cnpj;
      getMenu(estab_cnpj);
    } else {
      router.push('/home');
    }
  }, [comanda]);

  useEffect(() => {
    const type = router.query.tipo;

    if (type === tipo) {
      setTipo(null);
    } else {
      setTipo(type as string);
    }
  }, [router.query.tipo]);

  return (
    <Layout>
      <NavigationPills hasArrowBack />

      <MaxWidthWrapper>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-[16px] gap-y-[12px]'>
          {menu.map((item) => (
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
                ]);
              }}
            >
              <div
                className='relative w-full'
                style={{
                  aspectRatio: 1.09,
                }}
              >
                <Image
                  src={item.imagem || '/products/beer.webp'}
                  alt={item.nome}
                  layout='fill'
                  objectFit='cover'
                />
              </div>
              <div className='flex flex-col gap-y-[4px] p-[4px]'>
                <span className='text-[12px] font-[600] leading-[16px] tracking-[0.5px] text-[#000000]'>
                  {capitalize(item.nome)}
                </span>
                <span className='text-[11px] font-[500] leading-[14px] tracking-[0.5px] text-[#000000]'>
                  {currencyFormatter(item.preco)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </MaxWidthWrapper>
      <CartDrawer />
    </Layout>
  );
};

export default withAuthCustomer(MenuDaConta);

import React, { useEffect, useState } from 'react';
import { withAuthCustomer } from '@/hoc/withAuth';
import Layout from '@/layout';
import { NavigationPills } from '@/components/NavigationPills';
import { useComanda } from '@/contexts/ComandaContext';
import { useRouter } from 'next/router';
import { MenuService } from '@/services/menu.service';

const MenuDaConta: React.FC = () => {
  const { comanda } = useComanda();
  const router = useRouter();
  const [menu, setMenu] = useState<any[]>([]);

  const getMenu = async (cnpj: string) => {
    try {
      const itens = await MenuService.getItensByEstabelecimento(cnpj);
      setMenu(itens);
    } catch (error) {
      console.error(error);
      router.push('/home');
    }
  }

  useEffect(() => {
    if (comanda) {
      const estab_cnpj = comanda.num_cnpj;
      getMenu(estab_cnpj);
    } else {
      router.push('/home');
    }
  }, [comanda]);



  return (
    <Layout>
      <NavigationPills hasArrowBack />

      <div className='flex flex-col gap-4'>
        {menu.map((item) => (
          <div key={item.id}>
            <h1>{item.nome}</h1>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default withAuthCustomer(MenuDaConta);

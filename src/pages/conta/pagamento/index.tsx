import React from 'react';
import Layout from '@/layout';
import { withAuthCustomer } from '@/hoc/withAuth';
import { MaxWidthWrapper } from '@deuquantas/components';
import { useRouter } from 'next/router';
import { useComanda } from '@/contexts/ComandaContext';
import { CardFormCustom } from './CardFormCustom';

const CheckoutTransparente = () => {
  const router = useRouter();
  const { id_comanda, valor, tipoPagamento } = router.query;
  const { estabelecimento } = useComanda();

  return (
    <Layout>
      <MaxWidthWrapper
        styleContent={{
          paddingTop: '20px',
          paddingBottom: '81px',
        }}
      >
        <h2 className='text-2xl font-bold mb-4'>
          Checkout Transparente Mercado Pago
        </h2>
        {valor && (
          <div className='mb-4 text-lg font-semibold'>
            Valor a pagar: R$ {Number(valor).toFixed(2)}
          </div>
        )}
        {id_comanda && valor && estabelecimento?.num_cnpj && (
          <CardFormCustom
            valor={Number(valor)}
            id_comanda={id_comanda as string}
            tipoPagamento={tipoPagamento as string || 'individual'}
            num_cnpj={estabelecimento.num_cnpj}
            onSuccess={() => router.push('/pedidos')}
          />
        )}
      </MaxWidthWrapper>
    </Layout>
  );
};

export default withAuthCustomer(CheckoutTransparente);

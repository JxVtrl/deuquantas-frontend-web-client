import React, { useState, useEffect } from 'react';
import { api } from '@/lib/axios';
import { useRouter } from 'next/router';
import Layout from '@/layout';
import { withAuthCustomer } from '@/hoc/withAuth';
import { currencyFormatter } from '@/utils/formatters';
import { MaxWidthWrapper } from '@deuquantas/components';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Script from 'next/script';
import { useAuth } from '@/contexts/AuthContext';
import { useComanda } from '@/contexts/ComandaContext';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '';

const CheckoutTransparente = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const router = useRouter();
  const { id_comanda, valor, tipoPagamento } = router.query;
  const { user } = useAuth();
  const { estabelecimento } = useComanda();

  useEffect(() => {
    if (!PUBLIC_KEY) {
      setError('Chave pública do Mercado Pago não definida!');
      return;
    }
    if (typeof window !== 'undefined' && window.MercadoPago) {
      const mp = new window.MercadoPago(PUBLIC_KEY, { locale: 'pt-BR' });
      mp.bricks().create('cardPayment', 'form-checkout', {
        initialization: {
          amount: Number(valor) || 1,
        },
        callbacks: {
          onReady: () => {
            console.log('CardForm pronto');
          },
          onSubmit: async (cardFormData: any) => {
            try {
              const payload = {
                token: cardFormData.token,
                valor: Number(valor),
                descricao: 'Pagamento checkout transparente',
                id_comanda,
                tipoPagamento: tipoPagamento || 'individual',
                num_cnpj: estabelecimento?.num_cnpj,
              };
              const response = await api.post(
                '/pagamentos/checkout-transparente',
                payload,
              );
              if (response.data.success) {
                setSuccess('Pagamento realizado com sucesso!');
                router.push('/pedidos');
              } else {
                setError(
                  response.data.message || 'Erro ao processar pagamento',
                );
              }
            } catch (err: any) {
              setError(err.message || 'Erro ao processar pagamento');
            }
          },
          onError: (error: any) => {
            setError(error.message || 'Erro ao processar pagamento');
          },
        },
      });
    } else {
      console.log('Aguardando SDK Mercado Pago ou elemento form-checkout...');
    }
  }, [valor, id_comanda, tipoPagamento, router, estabelecimento]);

  return (
    <>
      <Script
        src='https://sdk.mercadopago.com/js/v2'
        strategy='beforeInteractive'
        onLoad={() => {
          console.log('Mercado Pago SDK carregado');
        }}
      />
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
              Valor a pagar: {currencyFormatter(Number(valor))}
            </div>
          )}
          <div id='form-checkout' className='my-6'></div>
          {error && <div className='text-red-600 mt-2'>{error}</div>}
          {success && <div className='text-green-600 mt-2'>{success}</div>}
        </MaxWidthWrapper>
      </Layout>
    </>
  );
};

export default withAuthCustomer(CheckoutTransparente);

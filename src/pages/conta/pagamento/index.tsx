import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const { estabelecimento } = useComanda();
  const brickRef = useRef<any>(null);

  // Função para montar o Brick
  const mountBrick = useCallback(() => {
    if (
      typeof window !== 'undefined' &&
      window.MercadoPago &&
      document.getElementById('form-checkout')
    ) {
      console.log('[Checkout] Montando CardForm...');
      const mp = new window.MercadoPago(PUBLIC_KEY, { locale: 'pt-BR' });
      mp.bricks()
        .create('cardPayment', 'form-checkout', {
          initialization: {
            amount: Number(valor) || 1,
          },
          customization: {
            fields: {
              payer: {
                email: { visible: false },
              },
            },
          },
          callbacks: {
            onReady: () => {
              console.log('[Checkout] CardForm pronto');
            },
            onSubmit: async (cardFormData: any) => {
              try {
                console.log(
                  '[Checkout] onSubmit - cardFormData:',
                  cardFormData,
                );
                const payload = {
                  token: cardFormData.token,
                  payment_method_id: cardFormData.payment_method_id,
                  valor: Number(valor),
                  descricao: `Pagamento ${estabelecimento?.nome_estab} - ${id_comanda}`,
                  id_comanda,
                  tipoPagamento: tipoPagamento || 'individual',
                  num_cnpj: estabelecimento?.num_cnpj,
                };
                console.log(
                  '[Checkout] Payload enviado para backend:',
                  payload,
                );
                const response = await api.post(
                  '/pagamentos/checkout-transparente',
                  payload,
                );
                console.log('[Checkout] Resposta do backend:', response.data);
                if (response.data.success) {
                  setSuccess('Pagamento realizado com sucesso!');
                  router.push('/pedidos');
                } else {
                  setError(
                    response.data.message || 'Erro ao processar pagamento',
                  );
                }
              } catch (err: any) {
                console.error('[Checkout] Erro ao processar pagamento:', err);
                setError(err.message || 'Erro ao processar pagamento');
              }
            },
            onError: (error: any) => {
              console.error('[Checkout] Erro no CardForm:', error);
              setError(error.message || 'Erro ao processar pagamento');
            },
          },
        })
        .then((brick: any) => {
          brickRef.current = brick;
        });
    } else {
      console.log(
        '[Checkout] SDK Mercado Pago ou elemento form-checkout não disponível ainda.',
      );
    }
  }, [valor, id_comanda, tipoPagamento, router, estabelecimento]);

  // Monta o Brick quando o script carrega
  const handleScriptLoad = () => {
    console.log('[Checkout] Script Mercado Pago carregado');
    mountBrick();
  };

  // Remonta o Brick quando as dependências mudam
  useEffect(() => {
    mountBrick();
    return () => {
      if (brickRef.current) {
        console.log('[Checkout] Desmontando CardForm...');
        brickRef.current.unmount();
        brickRef.current = null;
      }
    };
  }, [mountBrick]);

  return (
    <>
      <Script
        src='https://sdk.mercadopago.com/js/v2'
        strategy='beforeInteractive'
        onLoad={handleScriptLoad}
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

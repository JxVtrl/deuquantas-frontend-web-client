import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { api } from '@/lib/axios';
import { useRouter } from 'next/router';
import Layout from '@/layout';
import { withAuthCustomer } from '@/hoc/withAuth';
import { currencyFormatter } from '@/utils/formatters';
import { Button, MaxWidthWrapper } from '@deuquantas/components';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '';

const CheckoutTransparente = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [cardToken, setCardToken] = useState<string>('');
  const mpRef = useRef<any>(null);
  const router = useRouter();
  const { id_comanda, valor } = router.query;
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardholderName, setCardholderName] = useState<string>('');
  const [cardExpirationMonth, setCardExpirationMonth] = useState<string>('');
  const [cardExpirationYear, setCardExpirationYear] = useState<string>('');
  const [securityCode, setSecurityCode] = useState<string>('');
  const [identificationNumber, setIdentificationNumber] = useState<string>('');

  useEffect(() => {
    if (window.MercadoPago) {
      mpRef.current = new window.MercadoPago(PUBLIC_KEY, {
        locale: 'pt-BR',
      });
    }
  }, []);

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    if (!mpRef.current) {
      setError('SDK Mercado Pago não carregado');
      setLoading(false);
      return;
    }

    try {
      const result = await mpRef.current.card.createToken({
        cardNumber,
        cardholderName,
        cardExpirationMonth,
        cardExpirationYear,
        securityCode,
        identificationNumber,
      });
      console.log('result', result);
      if (result.error) {
        setError(result.error.message || 'Erro ao gerar token do cartão');
        setLoading(false);
        return;
      }
      const token = result.id;
      setCardToken(token);

      const payload = {
        token,
        valor: Number(valor),
        descricao: 'Pagamento checkout transparente',
        id_comanda,
      };

      console.log('payload', payload);

      // Envia para o backend
      const response = await api.post(
        '/pagamentos/checkout-transparente',
        payload,
      );

      console.log('response', response);

      if (response.data.success) {
        setSuccess('Pagamento realizado com sucesso!');
        router.push('/pedidos');
      } else {
        setError(response.data.message || 'Erro ao processar pagamento');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <MaxWidthWrapper
        styleContent={{
          paddingTop: '20px',
          paddingBottom: '81px',
        }}
      >
        <Script
          src='https://sdk.mercadopago.com/js/v2'
          strategy='beforeInteractive'
          onLoad={() => {
            if (window.MercadoPago) {
              mpRef.current = new window.MercadoPago(PUBLIC_KEY, {
                locale: 'pt-BR',
              });
            }
          }}
        />
        <h2 className='text-2xl font-bold mb-4'>
          Checkout Transparente Mercado Pago
        </h2>
        {valor && (
          <div className='mb-4 text-lg font-semibold'>
            Valor a pagar: {currencyFormatter(Number(valor))}
          </div>
        )}
        <div>
          <label className='block mb-1'>Número do cartão</label>
          <input
            name='cardNumber'
            className='w-full border rounded px-3 py-2'
            required
            maxLength={19}
            onChange={(e) => setCardNumber(e.target.value)}
            value={cardNumber}
          />
        </div>
        <div>
          <label className='block mb-1'>Nome impresso no cartão</label>
          <input
            name='cardholderName'
            className='w-full border rounded px-3 py-2'
            required
            onChange={(e) => setCardholderName(e.target.value)}
            value={cardholderName}
          />
        </div>
        <div className='flex gap-2'>
          <div className='flex-1'>
            <label className='block mb-1'>Mês expiração</label>
            <input
              name='cardExpirationMonth'
              className='w-full border rounded px-3 py-2'
              required
              maxLength={2}
              onChange={(e) => setCardExpirationMonth(e.target.value)}
              value={cardExpirationMonth}
            />
          </div>
          <div className='flex-1'>
            <label className='block mb-1'>Ano expiração</label>
            <input
              name='cardExpirationYear'
              className='w-full border rounded px-3 py-2'
              required
              maxLength={4}
              onChange={(e) => setCardExpirationYear(e.target.value)}
              value={cardExpirationYear}
            />
          </div>
        </div>
        <div>
          <label className='block mb-1'>CVV</label>
          <input
            name='securityCode'
            className='w-full border rounded px-3 py-2'
            required
            maxLength={4}
            onChange={(e) => setSecurityCode(e.target.value)}
            value={securityCode}
          />
        </div>
        <div>
          <label className='block mb-1'>CPF do titular</label>
          <input
            name='identificationNumber'
            className='w-full border rounded px-3 py-2'
            required
            maxLength={11}
            onChange={(e) => setIdentificationNumber(e.target.value)}
            value={identificationNumber}
          />
        </div>
        <Button
          onClick={() => void handleSubmit()}
          variant='primary'
          text='Pagar'
        />
        {error && <div className='text-red-600 mt-2'>{error}</div>}
        {success && <div className='text-green-600 mt-2'>{success}</div>}
        {cardToken && (
          <div className='mt-4 text-xs text-gray-500'>
            Token gerado: {cardToken}
          </div>
        )}
      </MaxWidthWrapper>
    </Layout>
  );
};

export default withAuthCustomer(CheckoutTransparente);

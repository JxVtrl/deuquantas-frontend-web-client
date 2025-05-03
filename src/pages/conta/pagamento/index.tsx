import React, { useState } from 'react';
import { api } from '@/lib/axios';
import { useRouter } from 'next/router';
import Layout from '@/layout';
import { withAuthCustomer } from '@/hoc/withAuth';
import { currencyFormatter } from '@/utils/formatters';
import { MaxWidthWrapper } from '@deuquantas/components';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Script from 'next/script';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '';

const CheckoutTransparente = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [cardToken, setCardToken] = useState<string>('');
  const router = useRouter();
  const { id_comanda, valor, tipoPagamento } = router.query;
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardholderName, setCardholderName] = useState<string>('');
  const [cardExpirationDate, setCardExpirationDate] = useState<string>('');
  const [securityCode, setSecurityCode] = useState<string>('');
  const [identificationNumber, setIdentificationNumber] = useState<string>('');

  const handlePayment = async () => {
    setError('');
    setSuccess('');

    if (typeof window === 'undefined' || !window.MercadoPago) {
      setError('SDK Mercado Pago não carregado');
      return;
    }

    const mp = new window.MercadoPago(PUBLIC_KEY, { locale: 'pt-BR' });
    console.log('mp', mp);

    try {
      let result;
      if (mp.card && mp.card.createToken) {
        result = await mp.card.createToken({
          cardNumber,
          cardholderName,
          cardExpirationDate,
          securityCode,
          identificationNumber,
        });
      } else if (mp.fields && mp.fields.createCardToken) {
        result = await mp.fields.createCardToken({
          cardNumber,
          cardholderName,
          cardExpirationDate,
          securityCode,
          identificationNumber,
        });
      } else {
        setError(
          'Método de tokenização do cartão não encontrado na SDK do Mercado Pago',
        );
        return;
      }

      console.log('result', result);
      if (result.error) {
        setError(result.error.message || 'Erro ao gerar token do cartão');
        return;
      }
      const token = result.id;
      setCardToken(token);

      const payload = {
        token,
        valor: Number(valor),
        descricao: 'Pagamento checkout transparente',
        id_comanda,
        tipoPagamento: tipoPagamento || 'individual',
      };

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
    }
  };

  const input_list = [
    {
      name: 'cardNumber',
      label: 'Número do cartão',
      placeholder: '1234 1234 1234 1234',
      value: cardNumber,
      onChange: setCardNumber,
    },
    {
      name: 'cardholderName',
      label: 'Nome impresso no cartão',
      placeholder: 'Nome impresso no cartão',
      value: cardholderName,
      onChange: setCardholderName,
    },
    {
      name: 'cardExpirationDate',
      label: 'Data de expiração',
      placeholder: 'MM/AA',
      value: cardExpirationDate,
      onChange: setCardExpirationDate,
    },
    {
      name: 'securityCode',
      label: 'CVV',
      placeholder: 'CVV',
      value: securityCode,
      onChange: setSecurityCode,
    },
    {
      name: 'identificationNumber',
      label: 'CPF do titular',
      placeholder: 'CPF do titular',
      value: identificationNumber,
      onChange: setIdentificationNumber,
    },
  ];

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
          <div className='grid grid-cols-1 gap-4'>
            {input_list.map((input) => {
              return (
                <div key={input.name} className='flex flex-col gap-2'>
                  <Label>{input.label}</Label>
                  <Input
                    value={input.value}
                    onChange={(e) => input.onChange(e.target.value)}
                    placeholder={input.placeholder}
                  />
                </div>
              );
            })}
          </div>
          <button
            onClick={() => {
              console.log('handlePayment');
              handlePayment();
            }}
            className='bg-primary text-white px-4 py-2 rounded-md'
          >
            Pagar
          </button>
          {error && <div className='text-red-600 mt-2'>{error}</div>}
          {success && <div className='text-green-600 mt-2'>{success}</div>}
          {cardToken && (
            <div className='mt-4 text-xs text-gray-500'>
              Token gerado: {cardToken}
            </div>
          )}
        </MaxWidthWrapper>
      </Layout>
    </>
  );
};

export default withAuthCustomer(CheckoutTransparente);

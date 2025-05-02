import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { api } from '@/lib/axios';
import { useRouter } from 'next/router';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '';

const CheckoutTransparente = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cardToken, setCardToken] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const mpRef = useRef<any>(null);
  const router = useRouter();
  const { id_comanda, valor } = router.query;

  useEffect(() => {
    if (window.MercadoPago) {
      mpRef.current = new window.MercadoPago(PUBLIC_KEY, {
        locale: 'pt-BR',
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!mpRef.current) {
      setError('SDK Mercado Pago não carregado');
      setLoading(false);
      return;
    }

    const form = formRef.current;
    if (!form) return;

    try {
      // Gera o token do cartão usando o form
      const result = await mpRef.current.card.createToken(form);
      if (result.error) {
        setError(result.error.message || 'Erro ao gerar token do cartão');
        setLoading(false);
        return;
      }
      const token = result.id;
      setCardToken(token);
      // Envia para o backend
      const response = await api.post('/pagamentos/checkout-transparente', {
        token,
        valor: Number(valor),
        descricao: 'Pagamento checkout transparente',
        id_comanda,
      });
      setSuccess('Pagamento realizado com sucesso!');
    } catch (err: any) {
      setError(err.message || 'Erro ao processar pagamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded shadow'>
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
          Valor a pagar: R${' '}
          {Number(valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      )}
      <form ref={formRef} onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block mb-1'>Número do cartão</label>
          <input
            name='cardNumber'
            className='w-full border rounded px-3 py-2'
            required
            maxLength={16}
          />
        </div>
        <div>
          <label className='block mb-1'>Nome impresso no cartão</label>
          <input
            name='cardholderName'
            className='w-full border rounded px-3 py-2'
            required
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
            />
          </div>
          <div className='flex-1'>
            <label className='block mb-1'>Ano expiração</label>
            <input
              name='cardExpirationYear'
              className='w-full border rounded px-3 py-2'
              required
              maxLength={4}
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
          />
        </div>
        <div>
          <label className='block mb-1'>CPF do titular</label>
          <input
            name='identificationNumber'
            className='w-full border rounded px-3 py-2'
            required
            maxLength={11}
          />
        </div>
        <button
          type='submit'
          className='w-full py-3 bg-[#FFCC00] text-black font-semibold rounded-lg hover:bg-[#E6B800] transition-colors'
          disabled={loading}
        >
          {loading ? 'Processando...' : 'Pagar'}
        </button>
        {error && <div className='text-red-600 mt-2'>{error}</div>}
        {success && <div className='text-green-600 mt-2'>{success}</div>}
      </form>
      {cardToken && (
        <div className='mt-4 text-xs text-gray-500'>
          Token gerado: {cardToken}
        </div>
      )}
    </div>
  );
};

export default CheckoutTransparente;

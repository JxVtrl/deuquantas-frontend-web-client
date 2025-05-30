import { initMercadoPago } from '@mercadopago/sdk-react';

export const initializeMercadoPago = () => {
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY;

  if (!publicKey) {
    console.error('Chave pública do Mercado Pago não configurada');
    return;
  }

  initMercadoPago(publicKey);
};

import { withAuthCustomer } from '@/hoc/withAuth';
import React, { useEffect } from 'react';
import { CustomerLayout } from '@/layout';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/router';
import { useCustomerContext } from '@/contexts/CustomerContext';

const CustomerQrCode: React.FC = () => {
  const router = useRouter();
  const { setActiveHomeTab } = useCustomerContext();

  const pass = true;

  useEffect(() => {
    if (pass) {
      router.push('/customer/comanda/1?clienteId=129');
      setActiveHomeTab('comanda');
    }
  }, [pass, router, setActiveHomeTab]);

  return (
    <CustomerLayout>
      <Scanner
        styles={{
          finderBorder: 2,
          container: {
            width: '100%',
            height: '100%',
          },
          video: {
            width: '100%',
            height: '100%',
          },
        }}
        onError={(err) => console.log('Error scanning QRCode', err)}
        onScan={(result) => {
          const mesaId = result[0].rawValue.slice(-1);
          const clienteId = 129;

          // /customer/comanda/${estabelecimentoId}/${mesaId}?clienteId=${clienteId}
          // ou
          // /customer/comanda/${estabelecimentoId}?mesaId=${mesaId}&clienteId=${clienteId}
          // ou
          // /customer/${estabelecimentoId}/comanda?mesaId=${mesaId}&clienteId=${clienteId}
          // ou
          // /customer/comanda/${mesaId}?clienteId=${clienteId}
          // ou
          // /customer/comanda/${mesaId} [dessa forma, o clienteId seria passado por meio de um cookie ou de um token de autenticação JWT, salvo no contexto do cliente]

          router.push(`/customer/comanda/${mesaId}?clienteId=${clienteId}`);
          setActiveHomeTab('comanda');
        }}
      />
    </CustomerLayout>
  );
};

export default withAuthCustomer(CustomerQrCode);

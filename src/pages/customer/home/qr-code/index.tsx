import { withAuthCustomer } from '@/hoc/withAuth';
import React from 'react';
import { CustomerLayout } from '@/layout';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/router';

const CustomerQrCode: React.FC = () => {
  const router = useRouter();

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
          console.log(result);

          const mesaId = result[0].rawValue.slice(-1);
          const clienteId = 129;

          router.push(`/customer/comanda/${mesaId}?clienteId=${clienteId}`);
        }}
      />
    </CustomerLayout>
  );
};

export default withAuthCustomer(CustomerQrCode);

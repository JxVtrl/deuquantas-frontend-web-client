import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import Image from 'next/image';
import { useRouter } from 'next/router';

const QrCodeCard: React.FC = () => {
  const router = useRouter();

  return (
    <Card
      className='w-[50%] max-w-[43.53vw] h-[282px] flex flex-col justify-between cursor-pointer bg-[#E7CDBD] backdrop-filter backdrop-blur-[20px] rounded-xl border border-[#E7CDBD] shadow-lg'
      onClick={() => {
        router.push('/customer/qr-code');
      }}
    >
      <CardHeader>
        <Image src='/icons/qr-code.svg' alt='QR Code' width={32} height={32} />
      </CardHeader>
      <CardContent>
        <p className='font-[400] text-black text-[14px] leading-[24px] m-0'>
          Escanear <span className='font-[700]'>QrCode</span>
        </p>
      </CardContent>
      <CardFooter>
        <p className='font-[400] text-black text-[12px] leading-[16px] m-0'>
          Adicione o bar para fazer seus pedidos e abrir sua comanda
        </p>
      </CardFooter>
    </Card>
  );
};

export default QrCodeCard;

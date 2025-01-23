import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { Scanner } from '@yudiel/react-qr-scanner';
import { useRouter } from "next/router";

const QrCodeCard: React.FC = () => {

  const router = useRouter();
  const [openQrCodeReaderScreen, setOpenQrCodeReaderScreen] = useState(false);

  const QrCodeReader = () => {
    return <Scanner
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
      onError={err => console.log('Error scanning QRCode', err)} onScan={(result) => {
        console.log(result)
        setOpenQrCodeReaderScreen(false);

        const mesaId = result[0].rawValue.slice(-1);
        const clienteId = 129;

        router.push(`/customer/comanda/${mesaId}?clienteId=${clienteId}`);
      }} />
  };


  return openQrCodeReaderScreen ? (
    <QrCodeReader />
  ) : (
    <Card
      className="w-[50%] max-w-[175px] h-[282px] flex flex-col justify-between cursor-pointer bg-[#E7CDBD] backdrop-filter backdrop-blur-[20px] rounded-xl border border-[#E7CDBD] shadow-lg"
      onClick={() => {
        setOpenQrCodeReaderScreen(true);
      }}
    >
      <CardHeader>
        <Image src="/icons/qr-code.svg" alt="QR Code" width={32} height={32} />
      </CardHeader>
      <CardContent>
        <p className="font-[400] text-black text-[14px] leading-[24px] m-0">
          Escanear <span className="font-[700]">QrCode</span>
        </p>
      </CardContent>
      <CardFooter>
        <p className="font-[400] text-black text-[12px] leading-[16px] m-0">
          Adicione o bar para fazer seus pedidos e abrir sua comanda
        </p>
      </CardFooter>
    </Card>
  );
};

export default QrCodeCard;

import { api } from '@/lib/axios';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { withAuthEstablishment } from '@/hoc/withAuth';
import EstablishmentLayout from '@/layout/EstablishmentLayout';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { Mesa } from '@/services/api/types';
import { toast } from 'react-hot-toast';
import { Download } from 'lucide-react';

const QrCodesManagement: React.FC = () => {
  const { user } = useAuth();
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.estabelecimento?.num_cnpj) {
      fetchMesas();
    }
  }, [user?.estabelecimento?.num_cnpj]);

  const fetchMesas = async () => {
    try {
      setLoading(true);
      if (user?.estabelecimento?.num_cnpj) {
        const response = await api.get(
          `/mesas/estabelecimento/${user.estabelecimento.num_cnpj}`,
        );
        setMesas(response.data);
      }
    } catch (error) {
      toast.error('Erro ao carregar mesas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQrCode = (mesa: Mesa) => {
    const qrCodeElement = document.getElementById(`qr-code-${mesa.numMesa}`);
    if (qrCodeElement) {
      const svg = qrCodeElement.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `qr-code-mesa-${mesa.numMesa}.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }
  };

  return (
    <EstablishmentLayout>
      <div className='h-[calc(100vh-120px)] overflow-hidden flex flex-col'>
        <div className='flex justify-between items-center p-6 border-b'>
          <h1 className='text-2xl font-bold'>QR Codes das Mesas</h1>
        </div>

        <div className='flex-1 overflow-y-auto py-6'>
          {loading ? (
            <div className='flex justify-center items-center h-full'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FFCC00]'></div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {mesas.map((mesa) => (
                <div
                  key={mesa.numMesa}
                  className='bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow'
                >
                  <div className='flex justify-between items-start mb-4'>
                    <div>
                      <h3 className='text-lg font-semibold'>
                        Mesa {mesa.numMesa}
                      </h3>
                      <p className='text-sm text-gray-500'>
                        Capacidade: {mesa.numMaxPax} pessoas
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div
                        className={`w-3 h-3 rounded-full ${
                          mesa.status === 'disponivel'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      />
                      <span className='text-sm font-medium'>
                        {mesa.status === 'disponivel'
                          ? 'Disponível'
                          : 'Ocupada'}
                      </span>
                    </div>
                  </div>

                  <div className='flex flex-col items-center gap-4'>
                    <div
                      id={`qr-code-${mesa.numMesa}`}
                      className='flex justify-center'
                    >
                      <QRCodeSVG
                        value={mesa.qrCode}
                        size={200}
                        level='H'
                        includeMargin
                      />
                    </div>
                    <Button
                      onClick={() => handleDownloadQrCode(mesa)}
                      className='bg-[#FFCC00] text-black hover:bg-[#FFCC00]/80'
                    >
                      <Download className='mr-2 h-4 w-4' />
                      Baixar QR Code
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </EstablishmentLayout>
  );
};

export default withAuthEstablishment(QrCodesManagement);

import { api } from '@/lib/axios';
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { withAuthEstablishment } from '@/hoc/withAuth';
import EstablishmentLayout from '@/layout/EstablishmentLayout';
import { Button } from '@/components/ui/button';
import { QRCodeSVG } from 'qrcode.react';
import { Mesa } from '@/services/api/types';
import { toast } from 'react-hot-toast';
import { Download } from 'lucide-react';
import MaxWidthLayout from '@/layout/MaxWidthLayout';

const QrCodesManagement: React.FC = () => {
  const { user } = useAuth();
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

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
        setMesas(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (error) {
      toast.error('Erro ao carregar mesas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQrCode = async (mesa: Mesa) => {
    try {
      setDownloading(mesa.numMesa);

      // Criar um Blob com o SVG
      const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="white"/>
        ${mesa.qrCode}
      </svg>`;

      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      // Atualizar a referência do link
      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = `qr-code-mesa-${mesa.numMesa}.svg`;
        downloadLinkRef.current.click();
      }

      // Limpar URL após um tempo
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      toast.error('Erro ao baixar QR Code');
      console.error(error);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <EstablishmentLayout>
      <MaxWidthLayout>
        <div className='h-[calc(100vh-120px)] flex flex-col gap-6 py-6'>
          <div className='flex justify-between items-center'>
            <h1 className='text-2xl font-bold'>QR Codes das Mesas</h1>
          </div>

          <div className='flex-1 overflow-y-auto'>
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
                      <div className='flex justify-center'>
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
                        disabled={downloading === mesa.numMesa}
                      >
                        <Download className='mr-2 h-4 w-4' />
                        {downloading === mesa.numMesa
                          ? 'Baixando...'
                          : 'Baixar QR Code'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Link virtual para download */}
        <a ref={downloadLinkRef} style={{ display: 'none' }} />
      </MaxWidthLayout>
    </EstablishmentLayout>
  );
};

export default withAuthEstablishment(QrCodesManagement);

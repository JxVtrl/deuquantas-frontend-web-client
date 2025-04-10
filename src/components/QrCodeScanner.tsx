import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QrCodeScannerProps {
  onResult: (result: string) => void;
  onError: (error: string) => void;
}

const QR_SCANNER_ID = 'qr-reader';

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({ onResult, onError }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  useEffect(() => {
    let retryTimeout: NodeJS.Timeout;
    const mountTimeout = setTimeout(() => {
      initializeScanner();
    }, 1000);

    const initializeScanner = async () => {
      if (isScanning) return;

      try {
        // Limpa qualquer instância anterior
        await stopScanner();

        // Verifica se o elemento existe
        const scannerElement = document.getElementById(QR_SCANNER_ID);
        if (!scannerElement) {
          throw new Error('Scanner element not found');
        }

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
          videoConstraints: {
            facingMode: 'environment',
            width: { min: 640, ideal: 1280, max: 1920 },
            height: { min: 480, ideal: 720, max: 1080 },
          },
        };

        const scanner = new Html5Qrcode(QR_SCANNER_ID);
        scannerRef.current = scanner;

        setIsScanning(true);
        await scanner.start(
          { facingMode: 'environment' },
          config,
          (decodedText) => {
            setIsScanning(false);
            stopScanner().then(() => {
              onResult(decodedText);
            });
          },
          (errorMessage) => {
            // Ignora erros comuns de leitura do QR code
            if (
              errorMessage.includes('NotFoundException') ||
              errorMessage.includes(
                'No MultiFormat Readers were able to detect the code',
              )
            ) {
              return;
            }

            console.error('QR Code scan error:', errorMessage);

            // Verifica se é um erro de tamanho e tenta reinicializar
            if (errorMessage.includes('IndexSizeError') && !isInitialized) {
              stopScanner().then(() => {
                retryTimeout = setTimeout(() => {
                  setIsScanning(false);
                  initializeScanner();
                }, 1000);
              });
              return;
            }

            if (errorMessage.includes('NotFoundError')) {
              onError('Câmera não encontrada');
            } else if (errorMessage.includes('NotAllowedError')) {
              onError('Permissão de câmera negada');
            } else {
              onError('Erro ao ler QR code');
            }
          },
        );

        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize scanner:', err);
        setIsScanning(false);
        onError('Erro ao iniciar scanner');

        // Tenta reinicializar após um erro
        retryTimeout = setTimeout(() => {
          initializeScanner();
        }, 2000);
      }
    };

    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      if (mountTimeout) {
        clearTimeout(mountTimeout);
      }
      stopScanner();
    };
  }, [onResult, onError, isScanning]);

  return (
    <div className='relative w-full max-w-md mx-auto'>
      <div
        id={QR_SCANNER_ID}
        className='overflow-hidden rounded-lg bg-black'
        style={{ minHeight: '300px', minWidth: '300px' }}
      />
      <p className='text-center mt-4 text-sm text-gray-600'>
        Posicione o QR Code no centro da câmera
      </p>
    </div>
  );
};

export default QrCodeScanner;

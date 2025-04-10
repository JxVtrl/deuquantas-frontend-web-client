import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QrCodeScannerProps {
  onResult: (qrCode: string) => void | Promise<void>;
  onError?: (error: string) => void;
}

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({ onResult, onError }) => {
  const [isStarting, setIsStarting] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const initializeScanner = async () => {
      try {
        if (!containerRef.current) return;

        // Solicitar permissão da câmera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setHasPermission(true);

        if (!mounted) return;

        // Inicializar o scanner
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText: string) => {
            onResult(decodedText);
          },
          (errorMessage: string) => {
            console.log(errorMessage);
          },
        );

        setIsStarting(false);
      } catch (error) {
        console.error('Erro ao inicializar scanner:', error);
        if (onError) {
          onError('Erro ao acessar a câmera. Verifique as permissões.');
        }
        setIsStarting(false);
      }
    };

    if (typeof window !== 'undefined') {
      initializeScanner();
    }

    return () => {
      mounted = false;
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onResult, onError]);

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div
        id='qr-reader'
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
      >
        {isStarting && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span>Iniciando câmera...</span>
          </div>
        )}
        {!hasPermission && !isStarting && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span>Permissão da câmera negada</span>
          </div>
        )}
      </div>
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{ width: '100%', height: '100%', border: '1px solid red' }}
        />
      </div>
    </div>
  );
};

export default QrCodeScanner;

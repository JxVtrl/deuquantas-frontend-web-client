import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import styles from './QrCodeScanner.module.scss';

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
    <div className={styles.container}>
      <div id='qr-reader' ref={containerRef} className={styles.reader}>
        {isStarting && (
          <div className={styles.loading}>
            <span>Iniciando câmera...</span>
          </div>
        )}
        {!hasPermission && !isStarting && (
          <div className={styles.error}>
            <span>Permissão da câmera negada</span>
          </div>
        )}
      </div>
      <div className={styles.overlay}>
        <div className={styles.frame} />
      </div>
    </div>
  );
};

export default QrCodeScanner;

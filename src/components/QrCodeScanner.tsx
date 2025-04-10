import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { CircularProgress, Alert, Button } from '@mui/material';
import { mesaService, SolicitacaoMesa } from '../services/mesa.service';

interface QrCodeScannerProps {
  onScanSuccess: (solicitacao: SolicitacaoMesa) => void;
}

const QrCodeScanner: React.FC<QrCodeScannerProps> = ({ onScanSuccess }) => {
  const [processando, setProcessando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clienteId] = useState(''); // TODO: Obter o clienteId do contexto ou props

  const handleScan = async (data: string | null) => {
    if (data) {
      try {
        setProcessando(true);
        setError(null);
        console.log('[DEBUG] QR Code detectado:', data);

        const qrData = JSON.parse(data);
        if (!qrData.num_cnpj || !qrData.numMesa) {
          throw new Error('QR Code inválido: dados incompletos');
        }

        console.log('[DEBUG] Tentando entrar na sala:', qrData.num_cnpj);
        await mesaService.joinRoom(qrData.num_cnpj);

        console.log('[DEBUG] Solicitando mesa:', qrData);
        const solicitacao = await mesaService.solicitarMesa(
          qrData.num_cnpj,
          qrData.numMesa,
          clienteId,
        );

        console.log('[DEBUG] Solicitação processada:', solicitacao);
        onScanSuccess(solicitacao);
      } catch (error) {
        console.error('[DEBUG] Erro ao processar QR code:', error);
        setError(
          error instanceof Error ? error.message : 'Erro ao processar QR code',
        );
      } finally {
        setProcessando(false);
      }
    }
  };

  return (
    <div className='qr-scanner-container'>
      {!error && (
        <div style={{ width: '100%' }}>
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={(result) => {
              if (result) {
                handleScan(result.getText());
              }
            }}
          />
        </div>
      )}
      {processando && (
        <div className='processing-overlay'>
          <CircularProgress />
          <p>Processando QR Code...</p>
        </div>
      )}
      {error && (
        <div className='error-container'>
          <Alert severity='error'>{error}</Alert>
          <Button
            variant='contained'
            color='primary'
            onClick={() => setError(null)}
            style={{ marginTop: '1rem' }}
          >
            Tentar Novamente
          </Button>
        </div>
      )}
    </div>
  );
};

export default QrCodeScanner;

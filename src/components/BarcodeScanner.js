import React, { useState } from 'react';
import Quagga from 'quagga';
import { QrReader } from 'react-qr-reader';

const QuaggaScanner = ({ onDetected }) => {
  const scannerRef = React.useRef(null);

  React.useEffect(() => {
    Quagga.init({
      inputStream: {
        type: 'LiveStream',
        target: scannerRef.current,
        constraints: {
          width: 640,
          height: 480,
          facingMode: 'environment' // ou 'user' para a câmera frontal
        }
      },
      decoder: {
        readers: [
          'code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader',
          'code_39_vin_reader', 'codabar_reader', 'upc_reader', 'upc_e_reader',
          'i2of5_reader'
        ]
      }
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((data) => {
      onDetected(data.codeResult.code);
    });

    return () => {
      Quagga.stop();
    };
  }, [onDetected]);

  return <div ref={scannerRef} style={{ width: '100%', height: '100%' }} />;
};

const QrCodeScanner = ({ onDetected }) => {
  return (
    <div style={{ width: '100%' }}>
      <QrReader
        delay={300}
        constraints={{ facingMode: 'environment' }}
        onResult={(result, error) => {
          if (result) {
            onDetected(result?.text);
          }
        }}
        style={{ width: '100%' }}
      />
    </div>
  );
};

const BarcodeScanner = ({ onDetected }) => {
  const [useQuagga, setUseQuagga] = useState(true);

  return (
    <div>
      <button onClick={() => setUseQuagga(!useQuagga)}>
        {useQuagga ? 'Usar QrReader' : 'Usar Quagga'}
      </button>
      {useQuagga ? (
        <QuaggaScanner onDetected={onDetected} />
      ) : (
        <QrCodeScanner onDetected={onDetected} />
      )}
    </div>
  );
};

export default BarcodeScanner;

import React, { useState } from 'react';
import axios from 'axios';
import BarcodeScanner from './BarcodeScanner';

const SteelEntry = () => {
  const [date, setDate] = useState('');
  const [corrida, setCorrida] = useState('');
  const [feixe, setFeixe] = useState('');
  const [peso, setPeso] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [manualEntry, setManualEntry] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEntry = { date, corrida, feixe, peso };
      await axios.post('http://192.168.0.78:5000/steel-entry', newEntry);
      alert('Entrada registrada com sucesso!');
      console.log(newEntry);
      // Limpar os campos após o registro
      setDate('');
      setCorrida('');
      setFeixe('');
      setPeso('');
    } catch (error) {
      console.error('Erro ao registrar a entrada:', error);
      alert('Erro ao registrar a entrada.');
    }
  };

  const handleDetected = (code) => {
    if (code.length !== 20) {
      setError('Código de barras inválido. Certifique-se de que ele possui exatamente 20 caracteres.');
      return;
    }
    setCorrida(code.substring(0, 7));
    setFeixe(code.substring(7, 10));
    setPeso(code.substring(10, 14));
    setIsScanning(false);
    setError('');
    alert(`Código detectado: ${code}\nCorrida: ${code.substring(0, 7)}\nFeixe: ${code.substring(7, 10)}\nPeso: ${code.substring(10, 14)}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Entrada de Aço</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Data:</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Corrida:</label>
          <input
            type="text"
            className="form-control small-input"
            value={corrida}
            onChange={(e) => setCorrida(e.target.value)}
            readOnly={!manualEntry}
          />
        </div>
        <div className="form-group mb-3">
          <label>Feixe:</label>
          <input
            type="text"
            className="form-control small-input"
            value={feixe}
            onChange={(e) => setFeixe(e.target.value)}
            readOnly={!manualEntry}
          />
        </div>
        <div className="form-group mb-3">
          <label>Peso (kg):</label>
          <input
            type="text"
            className="form-control small-input"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            readOnly={!manualEntry}
          />
        </div>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="manualEntryCheck"
            checked={manualEntry}
            onChange={(e) => setManualEntry(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="manualEntryCheck">
            Inserir manualmente
          </label>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">Registrar Entrada</button>
      </form>
      <button type="button" className="btn btn-secondary mt-2" onClick={() => setIsScanning(!isScanning)} disabled={manualEntry}>
        {isScanning ? 'Parar Escaneamento' : 'Escanear Código de Barras'}
      </button>
      {isScanning && <BarcodeScanner onDetected={handleDetected} />}
    </div>
  );
};

export default SteelEntry;

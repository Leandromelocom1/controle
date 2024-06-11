import React, { useState } from 'react';
import BarcodeScanner from './BarcodeScanner';
import axios from 'axios';

const SteelExit = () => {
  const [date, setDate] = useState('');
  const [corrida, setCorrida] = useState('');
  const [feixe, setFeixe] = useState('');
  const [peso, setPeso] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://192.168.0.78:5000/steel-exit', {
        date,
        corrida,
        feixe,
        peso,
      });

      if (response.status === 200) {
        alert('Saída de aço registrada com sucesso');
      } else {
        alert(`Erro: ${response.data.error}`);
      }
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  const handleDetected = async (code) => {
    if (code.length !== 20) {
      setError('Código de barras inválido. Certifique-se de que ele possui exatamente 20 caracteres.');
      return;
    }

    try {
      const response = await axios.get(`http://192.168.0.78:5000/steel-entry/${code.substring(0, 7)}`);
      if (response.status === 200) {
        const { feixe, peso } = response.data;
        setCorrida(code.substring(0, 7));
        setFeixe(feixe);
        setPeso(peso);
      } else {
        setError('Corrida não encontrada.');
      }
    } catch (error) {
      setError('Erro ao buscar a corrida.');
    }

    setIsScanning(false);
    setError('');
  };

  const handleCorridaChange = async (e) => {
    const value = e.target.value;
    setCorrida(value);
    if (value.length === 7) {
      try {
        const response = await axios.get(`http://192.168.0.78:5000/steel-entry/${value}`);
        if (response.status === 200) {
          const { feixe, peso } = response.data;
          setFeixe(feixe);
          setPeso(peso);
        } else {
          setError('Corrida não encontrada.');
        }
      } catch (error) {
        setError('Erro ao buscar a corrida.');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Saída de Aço</h2>
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
            className="form-control"
            value={corrida}
            onChange={handleCorridaChange}
            required
          />
          <button type="button" className="btn btn-secondary mt-2" onClick={() => setIsScanning(!isScanning)}>
            {isScanning ? 'Parar Escaneamento' : 'Escanear Código de Barras'}
          </button>
        </div>
        <div className="form-group mb-3">
          <label>Feixe:</label>
          <input
            type="text"
            className="form-control"
            value={feixe}
            readOnly
          />
        </div>
        <div className="form-group mb-3">
          <label>Peso (kg):</label>
          <input
            type="text"
            className="form-control"
            value={peso}
            readOnly
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">Registrar Saída</button>
      </form>
      {isScanning && <BarcodeScanner onDetected={handleDetected} />}
    </div>
  );
};

export default SteelExit;

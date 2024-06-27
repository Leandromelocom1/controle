import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const SteelEntry = () => {
  const [date, setDate] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [corrida, setCorrida] = useState('');
  const [feixe, setFeixe] = useState('');
  const [peso, setPeso] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [codigoProduto, setCodigoProduto] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [pesoBruto, setPesoBruto] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [barcode, setBarcode] = useState('');
  const [etiquetas, setEtiquetas] = useState([]);

  const handleDetected = useCallback((code) => {
    if (code.length !== 20) {
      setError('Código de barras inválido. Certifique-se de que ele possui exatamente 20 caracteres.');
      return;
    }
    const newEtiqueta = { corrida: code.substring(0, 7), feixe: code.substring(7, 10), peso: code.substring(10, 14) };
    setCorrida(code.substring(0, 7));
    setFeixe(code.substring(7, 10));
    setPeso(code.substring(10, 14));
    setEtiquetas((prevEtiquetas) => [...prevEtiquetas, newEtiqueta]);
    setError('');
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isScanning) {
        if (event.key === 'Enter') {
          handleDetected(barcode);
          setBarcode('');
        } else {
          setBarcode((prevBarcode) => prevBarcode + event.key);
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [barcode, isScanning, handleDetected]);

  const handleAccessKeySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://192.168.0.78:5000/consulta-nota-fiscal', { codigoBarras: accessKey });
      const { razaoSocial, codigoProduto, descricaoProduto, pesoBruto } = response.data;
      setRazaoSocial(razaoSocial);
      setCodigoProduto(codigoProduto);
      setDescricaoProduto(descricaoProduto);
      setPesoBruto(pesoBruto);
      setError('');
    } catch (error) {
      console.error('Erro ao consultar a nota fiscal:', error);
      setError('Erro ao consultar a nota fiscal.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newEntry = { date, razaoSocial, codigoProduto, descricaoProduto, pesoBruto, etiquetas };
      await axios.post('http://192.168.0.78:5000/steel-entry', newEntry);
      alert('Entrada registrada com sucesso!');
      setDate('');
      setAccessKey('');
      setRazaoSocial('');
      setCodigoProduto('');
      setDescricaoProduto('');
      setPesoBruto('');
      setCorrida('');
      setFeixe('');
      setPeso('');
      setEtiquetas([]);
    } catch (error) {
      console.error('Erro ao registrar a entrada:', error);
      alert('Erro ao registrar a entrada.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Entrada de Aço</h2>
      <form onSubmit={handleAccessKeySubmit}>
        <div className="form-group mb-3">
          <label>Chave de Acesso:</label>
          <input
            type="text"
            className="form-control"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mb-4">Consultar Nota Fiscal</button>
      </form>

      {razaoSocial && (
        <div>
          <h4>Dados da Nota Fiscal</h4>
          <p><strong>Razão Social:</strong> {razaoSocial}</p>
          <p><strong>Código do Produto:</strong> {codigoProduto}</p>
          <p><strong>Descrição do Produto:</strong> {descricaoProduto}</p>
          <p><strong>Peso Bruto:</strong> {pesoBruto}</p>
        </div>
      )}

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

        <h4>Conferência da Carga</h4>
        <div className="form-group mb-3">
          <label>Corrida:</label>
          <input
            type="text"
            className="form-control small-input"
            value={corrida}
            readOnly
          />
        </div>
        <div className="form-group mb-3">
          <label>Feixe:</label>
          <input
            type="text"
            className="form-control small-input"
            value={feixe}
            readOnly
          />
        </div>
        <div className="form-group mb-3">
          <label>Peso (kg):</label>
          <input
            type="text"
            className="form-control small-input"
            value={peso}
            readOnly
          />
        </div>

        <h4>Etiquetas</h4>
        {etiquetas.map((etiqueta, index) => (
          <div key={index} className="mb-3">
            <p><strong>Corrida:</strong> {etiqueta.corrida}</p>
            <p><strong>Feixe:</strong> {etiqueta.feixe}</p>
            <p><strong>Peso:</strong> {etiqueta.peso}</p>
          </div>
        ))}
        
        <button type="button" className="btn btn-secondary mb-3" onClick={() => setIsScanning(!isScanning)}>
          {isScanning ? 'Parar Escaneamento' : 'Escanear Código de Barras'}
        </button>
        
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="btn btn-primary">Registrar Entrada</button>
      </form>
    </div>
  );
};

export default SteelEntry;

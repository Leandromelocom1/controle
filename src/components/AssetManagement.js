// src/components/AssetManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [newAsset, setNewAsset] = useState({
    nome: '',
    tipo: '',
    marca: '',
    modelo: '',
    ano: '',
    dataCompra: '',
    atribuidoA: '',
    departamento: '',
    dataAtribuicao: '',
    cronogramaManutencao: '',
    metricasUso: '',
    condicao: '',
    metodoDepreciacao: '',
    detalhesIncidente: '',
    detalhesDescarte: '',
    detalhesAuditoria: '',
    detalhesGarantia: '',
    detalhesSeguro: '',
    detalhesTransferencia: '',
    consumoCombustivel: '',
    detalhesConformidade: '',
    detalhesCicloVida: '',
    detalhesAvaliacao: '',
    feedback: '',
    inventarioPecasReposicao: '',
    controleKm: '',
    trocaOleo: '',
    trocaPecas: '',
    trocaPneu: '',
    manutencaoPreventiva: '',
  });

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/assets`);
        setAssets(response.data);
      } catch (error) {
        console.error("Erro ao buscar os ativos", error);
      }
    };
    fetchAssets();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAsset({ ...newAsset, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      await axios.post(`${apiUrl}/assets`, newAsset);
      setNewAsset({
        nome: '',
        tipo: '',
        marca: '',
        modelo: '',
        ano: '',
        dataCompra: '',
        atribuidoA: '',
        departamento: '',
        dataAtribuicao: '',
        cronogramaManutencao: '',
        metricasUso: '',
        condicao: '',
        metodoDepreciacao: '',
        detalhesIncidente: '',
        detalhesDescarte: '',
        detalhesAuditoria: '',
        detalhesGarantia: '',
        detalhesSeguro: '',
        detalhesTransferencia: '',
        consumoCombustivel: '',
        detalhesConformidade: '',
        detalhesCicloVida: '',
        detalhesAvaliacao: '',
        feedback: '',
        inventarioPecasReposicao: '',
        controleKm: '',
        trocaOleo: '',
        trocaPecas: '',
        trocaPneu: '',
        manutencaoPreventiva: '',
      });
      const response = await axios.get(`${apiUrl}/assets`);
      setAssets(response.data);
      alert('Ativo cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar ativo', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestão de Ativos</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <h3>Cadastrar Ativo</h3>
        {Object.keys(newAsset).map((key) => (
          <div className="form-group" key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</label>
            {['dataCompra', 'dataAtribuicao', 'trocaOleo', 'trocaPecas', 'trocaPneu', 'manutencaoPreventiva'].includes(key) ? (
              <input
                type="date"
                className="form-control"
                name={key}
                value={newAsset[key]}
                onChange={handleChange}
              />
            ) : key === 'controleKm' ? (
              <input
                type="number"
                className="form-control"
                name={key}
                value={newAsset[key]}
                onChange={handleChange}
              />
            ) : (
              <input
                type="text"
                className="form-control"
                name={key}
                value={newAsset[key]}
                onChange={handleChange}
              />
            )}
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Registrar Ativo</button>
      </form>

      <h3>Ativos Registrados</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            {Object.keys(newAsset).map((key) => (
              <th key={key}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => (
            <tr key={index}>
              {Object.keys(newAsset).map((key) => (
                <td key={key}>{asset[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssetManagement;

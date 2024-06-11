import React, { useState } from 'react';
import axios from 'axios';

const SteelReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('http://192.168.0.78:5000/steel-report', {
        params: {
          startDate,
          endDate
        }
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Erro ao gerar o relatório de aço', error);
      alert('Erro ao gerar o relatório de aço');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Relatório de Aço</h2>
      <form onSubmit={handleGenerateReport}>
        <div className="form-group mb-3">
          <label>Data de Início:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Data de Fim:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Gerar Relatório</button>
      </form>
      {reportData.length > 0 && (
        <div className="mt-4">
          <h3>Dados do Relatório</h3>
          <ul className="list-group">
            {reportData.map((item, index) => (
              <li key={index} className="list-group-item">
                <p><strong>Data:</strong> {item.date}</p>
                <p><strong>Corrida:</strong> {item.corrida}</p>
                <p><strong>Feixe:</strong> {item.feixe}</p>
                <p><strong>Peso (kg):</strong> {item.peso}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SteelReport;

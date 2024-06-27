import React, { useState } from 'react';
import axios from 'axios';
import '../index.css'; // Certifique-se de importar o CSS global

const ToolForm = ({ refreshTools }) => {
  const [toolName, setToolName] = useState('');
  const [responsible, setResponsible] = useState('');
  const [employee, setEmployee] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [status, setStatus] = useState('Em aberto');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      await axios.post(`${apiUrl}/tools`, {
        toolName,
        responsible,
        employee,
        serialNumber,
        status
      });
      refreshTools();
      setToolName('');
      setResponsible('');
      setEmployee('');
      setSerialNumber('');
      setStatus('Em aberto');
    } catch (error) {
      console.error('Erro ao adicionar ferramenta', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tool-form">
      <h2 className="mb-4">Cadastro de Ferramentas</h2>
      <div className="form-group mb-3">
        <label>Ferramenta:</label>
        <input type="text" className="form-control" value={toolName} onChange={(e) => setToolName(e.target.value)} required />
      </div>
      <div className="form-group mb-3">
        <label>Descrição:</label>
        <input type="text" className="form-control" value={responsible} onChange={(e) => setResponsible(e.target.value)} required />
      </div>
      <div className="form-group mb-3">
        <label>Funcionário:</label>
        <input type="text" className="form-control" value={employee} onChange={(e) => setEmployee(e.target.value)} required />
      </div>
      <div className="form-group mb-3">
        <label>N° Série:</label>
        <input type="text" className="form-control" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn-primary">Adicionar Ferramenta</button>
    </form>
  );
};

export default ToolForm;

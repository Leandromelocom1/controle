// src/components/WorkRegisterForm.js
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';  
import '../App.css';

const WorkRegisterForm = ({ refreshWorks }) => {
  const [client, setClient] = useState('');
  const [workAddress, setWorkAddress] = useState('');
  const [workPeriod, setWorkPeriod] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/works`, {
        client,
        workAddress,
        workPeriod,
      });
      refreshWorks();
      setClient('');
      setWorkAddress('');
      setWorkPeriod('');
      alert('Obra cadastrada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar obra', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container work-register-form">
      <h2>Cadastro de Obras</h2>
      <div className="form-group">
        <label>Cliente:</label>
        <input
          type="text"
          className="form-control"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Endereço da Obra:</label>
        <input
          type="text"
          className="form-control"
          value={workAddress}
          onChange={(e) => setWorkAddress(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>Período da Obra:</label>
        <input
          type="text"
          className="form-control"
          value={workPeriod}
          onChange={(e) => setWorkPeriod(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Cadastrar</button>
    </form>
  );
};

export default WorkRegisterForm;

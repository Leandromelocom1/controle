// src/components/ToolRegisterForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const ToolRegisterForm = ({ refreshTools }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [toolId, setToolId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setToolId(uuidv4()); // Gera um novo ID quando o componente é montado
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Utiliza a variável de ambiente ou um valor padrão
    try {
      await axios.post(`${apiUrl}/tools`, {
        toolName: name,
        description,
        toolId,
        serialNumber,
        status: 'Em estoque'
      });
      refreshTools();
      setName('');
      setDescription('');
      setToolId(uuidv4()); // Gera um novo ID após o cadastro
      setSerialNumber('');
      setError('');
      alert('Ferramenta cadastrada com sucesso!');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError('Número de série já existe');
      } else {
        setError('Erro ao cadastrar a ferramenta');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tool-register-form">
      <h2 className="mb-4">Cadastro de Ferramentas</h2>
      <div className="form-group mb-3">
        <label htmlFor="name">Nome:</label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="description">Descrição:</label>
        <input
          type="text"
          className="form-control"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <input
        type="hidden"
        value={toolId}
        readOnly
      />
      <div className="form-group mb-3">
        <label htmlFor="serialNumber">S/N:</label>
        <input
          type="text"
          className="form-control"
          id="serialNumber"
          value={serialNumber}
          onChange={(e) => setSerialNumber(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-danger">{error}</p>}
      <button type="submit" className="btn btn-primary">Cadastrar</button>
    </form>
  );
};

export default ToolRegisterForm;

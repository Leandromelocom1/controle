import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const WorkForm = ({ refreshWorks }) => {
  const [quantity, setQuantity] = useState('');
  const [name, setName] = useState('');
  const [workId, setWorkId] = useState('');
  const [work, setWork] = useState('');
  const [responsible, setResponsible] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [partialReturn, setPartialReturn] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      await axios.post(`${apiUrl}/works`, {
        quantity,
        name,
        workId,
        work,
        responsible,
        returnDate,
        partialReturn,
      });
      refreshWorks();
      setQuantity('');
      setName('');
      setWorkId('');
      setWork('');
      setResponsible('');
      setReturnDate('');
      setPartialReturn('');
    } catch (error) {
      console.error('Erro ao adicionar obra', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2 className="mb-4">Cadastrar Obra</h2>
      <div className="form-group mb-3">
        <label>Quantidade:</label>
        <input
          type="number"
          className="form-control"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label>Nome:</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label>ID:</label>
        <input
          type="text"
          className="form-control"
          value={workId}
          onChange={(e) => setWorkId(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label>Obra:</label>
        <input
          type="text"
          className="form-control"
          value={work}
          onChange={(e) => setWork(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label>Responsável pela Retirada:</label>
        <input
          type="text"
          className="form-control"
          value={responsible}
          onChange={(e) => setResponsible(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label>Data de Retorno:</label>
        <input
          type="date"
          className="form-control"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label>Retorno Parcial:</label>
        <input
          type="text"
          className="form-control"
          value={partialReturn}
          onChange={(e) => setPartialReturn(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">Cadastrar</button>
    </form>
  );
};

export default WorkForm;

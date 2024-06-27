// src/components/WithdrawalForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const WithdrawalForm = ({ refreshTools }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [toolId, setToolId] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [selectedWork, setSelectedWork] = useState('');
  const [responsible, setResponsible] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [internalUse, setInternalUse] = useState(false);
  const [works, setWorks] = useState([]);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/works`);
        setWorks(response.data);
      } catch (error) {
        console.error("Erro ao buscar as obras", error);
      }
    };

    const fetchTools = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/tools/available`);
        setTools(response.data);
      } catch (error) {
        console.error("Erro ao buscar as ferramentas", error);
      }
    };
    fetchWorks();
    fetchTools();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      await axios.patch(`${apiUrl}/tools/${toolId}`, {
        toolName: name,
        description,
        serialNumber,
        status: 'Retirada',
        work: internalUse ? '' : selectedWork,
        responsible,
        returnDate,
      });

      setName('');
      setDescription('');
      setToolId('');
      setSerialNumber('');
      setSelectedWork('');
      setResponsible('');
      setReturnDate('');
      setInternalUse(false);
      refreshTools();
      alert('Ferramenta retirada com sucesso!');
    } catch (error) {
      console.error('Erro ao retirar a ferramenta', error);
      alert('Erro ao retirar a ferramenta.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4 withdrawal-form">
      <h2 className="mb-4">Retirar Ferramenta</h2>
      <div className="form-group mb-3">
        <label>Ferramenta:</label>
        <select
          className="form-control"
          value={toolId}
          onChange={(e) => {
            const selectedTool = tools.find(tool => tool._id === e.target.value);
            if (selectedTool) {
              setToolId(selectedTool._id);
              setName(selectedTool.toolName);
              setDescription(selectedTool.description);
              setSerialNumber(selectedTool.serialNumber);
            }
          }}
          required
        >
          <option value="">Selecione uma ferramenta</option>
          {tools.map(tool => (
            <option key={tool._id} value={tool._id}>{tool.toolName} - {tool.serialNumber}</option>
          ))}
        </select>
      </div>
      <div className="form-group mb-3">
        <label>Descrição:</label>
        <input
          type="text"
          className="form-control"
          value={description}
          readOnly
        />
      </div>
      <div className="form-group mb-3">
        <label>Número de Série:</label>
        <input
          type="text"
          className="form-control"
          value={serialNumber}
          readOnly
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
        <label>Previsão para Retorno:</label>
        <input
          type="date"
          className="form-control"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          required
        />
      </div>
      <div className="form-group form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="internalUseCheck"
          checked={internalUse}
          onChange={(e) => setInternalUse(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="internalUseCheck">Uso Interno</label>
      </div>
      <div className="form-group mb-3">
        <label>Obra:</label>
        <select
          className="form-control"
          value={selectedWork}
          onChange={(e) => setSelectedWork(e.target.value)}
          disabled={internalUse}
          required={!internalUse}
        >
          <option value="">Selecione uma obra</option>
          {works.map(work => (
            <option key={work._id} value={work._id}>{work.client} - {work.workAddress}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">Retirar</button>
    </form>
  );
};

export default WithdrawalForm;

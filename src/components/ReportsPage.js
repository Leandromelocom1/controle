// src/components/ReportsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Certifique-se de que o arquivo CSS foi importado corretamente

const ReportsPage = () => {
  const [tools, setTools] = useState([]);
  const [filter, setFilter] = useState('');
  const [filteredTools, setFilteredTools] = useState([]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/tools`);
        setTools(response.data);
        setFilteredTools(response.data);
      } catch (error) {
        console.error("Erro ao buscar as ferramentas", error);
      }
    };

    fetchTools();
  }, []);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    const filtered = tools.filter(tool => tool.status.toLowerCase().includes(e.target.value.toLowerCase()));
    setFilteredTools(filtered);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Relatórios de Ferramentas</h2>
      <div className="form-group mb-4">
        <label htmlFor="filter">Filtrar por Status:</label>
        <input
          type="text"
          className="form-control"
          id="filter"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Digite o status para filtrar..."
        />
      </div>
      <ul className="list-group">
        {filteredTools.map((tool) => (
          <li key={tool._id} className="list-group-item">
            <div><strong>Nome:</strong> {tool.toolName}</div>
            <div><strong>Descrição:</strong> {tool.description}</div>
            <div><strong>Número de Série:</strong> {tool.serialNumber}</div>
            <div><strong>Status:</strong> {tool.status}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportsPage;

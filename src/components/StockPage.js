// src/components/StockPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const StockPage = () => {
  const [tools, setTools] = useState([]);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/tools`);
        setTools(response.data);
      } catch (error) {
        console.error("Erro ao buscar as ferramentas", error);
      }
    };
    fetchTools();
  }, []);

  const renderTool = (tool) => (
    <li key={tool._id} className="list-group-item">
      <strong>Ferramenta:</strong> {tool.toolName} <br />
      <strong>Descrição:</strong> {tool.description} <br />
      <strong>Número de Série:</strong> {tool.serialNumber} <br />
      <strong>Responsável:</strong> {tool.responsible} <br />
      <strong>Status:</strong> {tool.status} <br />
    </li>
  );

  return (
    <div className="container mt-4 stock-page">
      <h1 className="mb-4">Ferramentas</h1>
      <h2 className="mt-4">Estoque</h2>
      <ul className="list-group mb-4">
        {tools.filter(tool => tool.status === 'Em estoque').map(renderTool)}
      </ul>
      <h2>Retiradas</h2>
      <ul className="list-group mb-4">
        {tools.filter(tool => tool.status === 'Retirada').map(renderTool)}
      </ul>
      <h2>Manutenção</h2>
      <ul className="list-group mb-4">
        {tools.filter(tool => tool.status === 'Em manutenção').map(renderTool)}
      </ul>
      <h2>Reparadas</h2>
      <ul className="list-group mb-4">
        {tools.filter(tool => tool.status === 'Reparado').map(renderTool)}
      </ul>
    </div>
  );
};

export default StockPage;

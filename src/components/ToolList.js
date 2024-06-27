import React from 'react';
import axios from 'axios';

const ToolList = ({ tools, setTools, refreshTools }) => {
  const handleRemove = async (id) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      await axios.patch(`${apiUrl}/tools/${id}`, { status: 'Baixada' });
      refreshTools();
    } catch (error) {
      console.error("Erro ao dar baixa na ferramenta", error);
    }
  };

  const handleDefect = async (id) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      await axios.patch(`${apiUrl}/tools/${id}`, { status: 'Defeito' });
      refreshTools();
    } catch (error) {
      console.error("Erro ao marcar a ferramenta como defeituosa", error);
    }
  };

  return (
    <div className="tool-list-container">
      <h2>Lista de Ferramentas</h2>
      <ul className="tool-list">
        {tools.map(tool => (
          <li key={tool._id} className="list-group-item">
            <strong>Ferramenta:</strong> {tool.toolName} <br />
            <strong>Descrição:</strong> {tool.responsible} <br />
            <strong>Funcionário:</strong> {tool.employee} <br />
            <strong>N° Série:</strong> {tool.serialNumber} <br />
            <strong>Status:</strong> {tool.status} <br />
            <button onClick={() => handleRemove(tool._id)} className="btn btn-danger me-2">Dar Baixa</button>
            <button onClick={() => handleDefect(tool._id)} className="btn btn-warning">Baixa com Defeito</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ToolList;

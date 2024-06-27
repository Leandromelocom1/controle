// src/components/MaintenancePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

const MaintenancePage = () => {
  const [defectiveTools, setDefectiveTools] = useState([]);
  const [problemDescription, setProblemDescription] = useState('');
  const [solutionDescription, setSolutionDescription] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchDefectiveTools = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/tools`, { params: { status: 'Em manutenção' } });
        setDefectiveTools(response.data);
      } catch (error) {
        console.error("Erro ao buscar as ferramentas com defeito", error);
      }
    };
    fetchDefectiveTools();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      await axios.patch(`${apiUrl}/tools/${id}`, { status });
      setDefectiveTools(defectiveTools.map(tool => tool._id === id ? { ...tool, status } : tool));
      alert(`Status da ferramenta atualizado para ${status}.`);
    } catch (error) {
      console.error("Erro ao atualizar o status da ferramenta", error);
      alert('Erro ao atualizar o status da ferramenta.');
    }
  };

  const handleRepair = async (id) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      await axios.patch(`${apiUrl}/tools/${id}`, {
        status: 'Em estoque',
        problemDescription,
        solutionDescription
      });
      setDefectiveTools(defectiveTools.filter(tool => tool._id !== id));
      alert('Ferramenta marcada como reparada e retornada ao estoque.');
      setProblemDescription('');
      setSolutionDescription('');
    } catch (error) {
      console.error("Erro ao marcar a ferramenta como reparada", error);
      alert('Erro ao marcar a ferramenta como reparada.');
    }
  };

  const handleSendEmail = async (tool) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      await axios.post(`${apiUrl}/send-email`, {
        to: email,
        subject: `Peças necessárias para manutenção da ferramenta ${tool.toolName}`,
        text: `A ferramenta ${tool.toolName} com número de série ${tool.serialNumber} precisa das seguintes peças para manutenção: ${problemDescription}.`,
        toolId: tool._id  // Passando o id da ferramenta para atualização do status
      });
      alert('Email enviado para o setor de compras.');
      setEmail('');
    } catch (error) {
      console.error('Erro ao enviar email', error);
      alert('Erro ao enviar email.');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Gestão de Manutenção</h1>
      <ul className="list-group">
        {defectiveTools.map((tool) => (
          <li key={tool._id} className="list-group-item d-flex justify-content-between align-items-start mb-3">
            <div className="ms-2 me-auto">
              <div className="fw-bold">Ferramenta: {tool.toolName}</div>
              <div>Liberado por: {tool.responsible}</div>
              <div>Funcionário: {tool.employee}</div>
              <div>Status: {tool.status}</div>
              <div>
                <label htmlFor={`problemDescription-${tool._id}`}>Descrição do Problema:</label>
                <textarea
                  id={`problemDescription-${tool._id}`}
                  className="form-control mb-2"
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`solutionDescription-${tool._id}`}>Descrição da Solução:</label>
                <textarea
                  id={`solutionDescription-${tool._id}`}
                  className="form-control mb-2"
                  value={solutionDescription}
                  onChange={(e) => setSolutionDescription(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`email-${tool._id}`}>Email para Compras:</label>
                <input
                  type="email"
                  id={`email-${tool._id}`}
                  className="form-control mb-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button onClick={() => handleUpdateStatus(tool._id, 'Em manutenção')} className="btn btn-warning me-2">Marcar como Em Manutenção</button>
              <button onClick={() => handleRepair(tool._id)} className="btn btn-success me-2">Marcar como Reparado</button>
              <button onClick={() => handleSendEmail(tool)} className="btn btn-primary">Enviar Email</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaintenancePage;

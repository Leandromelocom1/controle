// src/components/UserRegisterForm.js
import React, { useState } from 'react';
import axios from 'axios';

const UserRegisterForm = ({ refreshUsers }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [error, setError] = useState('');

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setPermissions(prevPermissions => 
      checked ? [...prevPermissions, value] : prevPermissions.filter(p => p !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000'; // Ajuste a URL conforme necessário
    try {
      await axios.post(`${apiUrl}/users`, {
        username,
        password,
        permissions
      });
      refreshUsers();
      setUsername('');
      setPassword('');
      setPermissions([]);
      setError('');
      alert('Usuário cadastrado com sucesso!');
    } catch (error) {
      setError('Erro ao cadastrar o usuário');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4 user-register-form">
      <h2 className="mb-4">Cadastro de Usuários</h2>
      <div className="form-group mb-3">
        <label htmlFor="username">Nome de Usuário:</label>
        <input
          type="text"
          className="form-control"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="form-group mb-3">
        <label>Permissões:</label>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="admin"
            value="admin"
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="admin">Administração</label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="toolManagement"
            value="toolManagement"
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="toolManagement">Gerenciamento de Ferramentas</label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="workManagement"
            value="workManagement"
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="workManagement">Gerenciamento de Obras</label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="maintenance"
            value="maintenance"
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="maintenance">Manutenção</label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="reports"
            value="reports"
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="reports">Relatórios</label>
        </div>
      </div>
      {error && <p className="text-danger">{error}</p>}
      <button type="submit" className="btn btn-primary">Cadastrar</button>
    </form>
  );
};

export default UserRegisterForm;

import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import '../App.css';

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
    const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
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
    <Container className="user-register-form">
      <h2 className="mb-4">Cadastro de Usuários</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nome de Usuário:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Senha:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Permissões:</Form.Label>
          <Form.Check
            type="checkbox"
            label="Administração"
            value="admin"
            onChange={handleCheckboxChange}
          />
          <Form.Check
            type="checkbox"
            label="Gerenciamento de Ferramentas"
            value="toolManagement"
            onChange={handleCheckboxChange}
          />
          <Form.Check
            type="checkbox"
            label="Gerenciamento de Obras"
            value="workManagement"
            onChange={handleCheckboxChange}
          />
          <Form.Check
            type="checkbox"
            label="Manutenção"
            value="maintenance"
            onChange={handleCheckboxChange}
          />
          <Form.Check
            type="checkbox"
            label="Relatórios"
            value="reports"
            onChange={handleCheckboxChange}
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button type="submit" variant="primary">Cadastrar</Button>
      </Form>
    </Container>
  );
};

export default UserRegisterForm;

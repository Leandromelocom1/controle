// src/components/DriverRegisterForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import '../App.css';

const DriverRegisterForm = () => {
  const [driver, setDriver] = useState({
    nome: '',
    cnh: '',
    validadeCnh: '',
    dataNascimento: '',
    endereco: '',
    telefone: '',
    email: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriver({
      ...driver,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      await axios.post(`${apiUrl}/drivers`, driver);
      setMessage('Motorista cadastrado com sucesso!');
      setDriver({
        nome: '',
        cnh: '',
        validadeCnh: '',
        dataNascimento: '',
        endereco: '',
        telefone: '',
        email: ''
      });
    } catch (error) {
      setMessage('Erro ao cadastrar motorista.');
    }
  };

  return (
    <Container className="driver-register-form">
      <h2>Cadastro de Motorista</h2>
      {message && <Alert variant={message.includes('sucesso') ? 'success' : 'danger'}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="nome">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            name="nome"
            value={driver.nome}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="cnh">
          <Form.Label>CNH</Form.Label>
          <Form.Control
            type="text"
            name="cnh"
            value={driver.cnh}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="validadeCnh">
          <Form.Label>Validade da CNH</Form.Label>
          <Form.Control
            type="date"
            name="validadeCnh"
            value={driver.validadeCnh}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="dataNascimento">
          <Form.Label>Data de Nascimento</Form.Label>
          <Form.Control
            type="date"
            name="dataNascimento"
            value={driver.dataNascimento}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="endereco">
          <Form.Label>Endereço</Form.Label>
          <Form.Control
            type="text"
            name="endereco"
            value={driver.endereco}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="telefone">
          <Form.Label>Telefone</Form.Label>
          <Form.Control
            type="text"
            name="telefone"
            value={driver.telefone}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={driver.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">Cadastrar</Button>
      </Form>
    </Container>
  );
};

export default DriverRegisterForm;

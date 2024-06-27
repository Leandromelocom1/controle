// src/components/FleetManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import '../App.css'; // Importação do CSS

const FleetManagement = () => {
  const [fleet, setFleet] = useState({
    assetId: '',
    kmSaida: '',
    kmEntrada: '',
    consumoCombustivel: '',
    motoristaId: '' // Campo para o ID do motorista
  });
  const [message, setMessage] = useState('');
  const [assets, setAssets] = useState([]);
  const [drivers, setDrivers] = useState([]); // Estado para armazenar os motoristas

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/assets`);
        setAssets(response.data);
      } catch (error) {
        console.error('Erro ao buscar ativos', error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/drivers`);
        setDrivers(response.data);
      } catch (error) {
        console.error('Erro ao buscar motoristas', error);
      }
    };

    fetchAssets();
    fetchDrivers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFleet({
      ...fleet,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      await axios.post(`${apiUrl}/fleet/register-km`, fleet);
      setMessage('Saída registrada com sucesso!');
      setFleet({
        assetId: '',
        kmSaida: '',
        kmEntrada: '',
        consumoCombustivel: '',
        motoristaId: '' // Reseta o campo do motorista
      });
    } catch (error) {
      setMessage('Erro ao registrar saída.');
    }
  };

  return (
    <Container>
      <h2>Saída de Veículo</h2>
      {message && <Alert variant={message.includes('sucesso') ? 'success' : 'danger'}>{message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="assetId">
          <Form.Label>Veículo</Form.Label>
          <Form.Control
            as="select"
            name="assetId"
            value={fleet.assetId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o veículo</option>
            {assets.map((asset) => (
              <option key={asset._id} value={asset._id}>
                {asset.nome}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="kmSaida">
          <Form.Label>KM de Saída</Form.Label>
          <Form.Control
            type="number"
            name="kmSaida"
            value={fleet.kmSaida}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="kmEntrada">
          <Form.Label>KM de Entrada</Form.Label>
          <Form.Control
            type="number"
            name="kmEntrada"
            value={fleet.kmEntrada}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="consumoCombustivel">
          <Form.Label>Consumo de Combustível</Form.Label>
          <Form.Control
            type="number"
            name="consumoCombustivel"
            value={fleet.consumoCombustivel}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="motoristaId">
          <Form.Label>Motorista</Form.Label>
          <Form.Control
            as="select"
            name="motoristaId"
            value={fleet.motoristaId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione o motorista</option>
            {drivers.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver.nome}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">Registrar Saída</Button>
      </Form>
    </Container>
  );
};

export default FleetManagement;

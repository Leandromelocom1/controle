import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col } from 'react-bootstrap';
import '../App.css';

const VehicleExitForm = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [kmAtual, setKmAtual] = useState('');
  const [avarias, setAvarias] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://192.168.0.78:5000/assets/available');
        setVehicles(response.data);
      } catch (error) {
        console.error('Erro ao buscar veículos disponíveis:', error);
      }
    };

    const fetchDrivers = async () => {
      try {
        const response = await axios.get('http://192.168.0.78:5000/drivers');
        setDrivers(response.data);
      } catch (error) {
        console.error('Erro ao buscar motoristas:', error);
      }
    };

    fetchVehicles();
    fetchDrivers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://192.168.0.78:5000/fleet/saida', {
        assetId: selectedVehicle,
        kmAtual,
        motoristaId: selectedDriver,
        avarias
      });
      console.log('Saída registrada:', response.data);
      // Atualize a lista de veículos disponíveis
      const updatedVehicles = vehicles.filter(vehicle => vehicle._id !== selectedVehicle);
      setVehicles(updatedVehicles);
    } catch (error) {
      console.error('Erro ao registrar saída do veículo:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="vehicle-exit-form">
      <h3>Registrar Saída de Veículo</h3>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>Veículo</Form.Label>
        <Col sm={10}>
          <Form.Control
            as="select"
            value={selectedVehicle}
            onChange={(e) => setSelectedVehicle(e.target.value)}
            required
          >
            <option value="">Selecione um veículo</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle._id} value={vehicle._id}>
                {vehicle.nome} - {vehicle.modelo}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>Motorista</Form.Label>
        <Col sm={10}>
          <Form.Control
            as="select"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            required
          >
            <option value="">Selecione um motorista</option>
            {drivers.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver.nome}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>Km Atual</Form.Label>
        <Col sm={10}>
          <Form.Control
            type="number"
            value={kmAtual}
            onChange={(e) => setKmAtual(e.target.value)}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>Avarias</Form.Label>
        <Col sm={10}>
          <Form.Control
            as="textarea"
            value={avarias}
            onChange={(e) => setAvarias(e.target.value)}
          />
        </Col>
      </Form.Group>

      <Button variant="primary" type="submit">
        Registrar Saída
      </Button>
    </Form>
  );
};

export default VehicleExitForm;

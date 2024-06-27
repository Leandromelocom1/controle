import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col } from 'react-bootstrap';

function VehicleReturnForm() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [currentKm, setCurrentKm] = useState('');
  const [returnNotes, setReturnNotes] = useState('');

  useEffect(() => {
    // Fetch vehicles
    const fetchVehicles = async () => {
      const response = await axios.get('http://192.168.0.78:5000/assets');
      setVehicles(response.data);
    };

    fetchVehicles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://192.168.0.78:5000/fleet/entrada', {
        assetId: selectedVehicle,
        kmAtual: currentKm,
        avarias: returnNotes,
      });
      alert('Vehicle return registered successfully');
      // Atualize a lista de veículos disponíveis
      const updatedVehicles = vehicles.filter(vehicle => vehicle._id !== selectedVehicle);
      setVehicles(updatedVehicles);
    } catch (error) {
      alert('Failed to register vehicle return');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="vehicle-return-form">
      <h3>Retorno de Veículo</h3>
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
                {vehicle.nome}
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
            value={currentKm}
            onChange={(e) => setCurrentKm(e.target.value)}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={2}>Notas</Form.Label>
        <Col sm={10}>
          <Form.Control
            as="textarea"
            value={returnNotes}
            onChange={(e) => setReturnNotes(e.target.value)}
          />
        </Col>
      </Form.Group>

      <Button variant="primary" type="submit">
        Registrar Retorno
      </Button>
    </Form>
  );
}

export default VehicleReturnForm;

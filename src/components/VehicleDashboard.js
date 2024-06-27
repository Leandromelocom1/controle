import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

const VehicleDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get('http://192.168.0.78:5000/assets/details');
        setVehicles(response.data);
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
      }
    };

    fetchVehicles();
  }, []);

  const checkForOilChangeAlert = (vehicle) => {
    const lastExit = vehicle.fleet.saidas[vehicle.fleet.saidas.length - 1];
    if (lastExit) {
      const kmRestanteTrocaOleo = vehicle.fleet.trocaOleoKm - (vehicle.fleet.kmEntrada - lastExit.kmAtual);
      if (kmRestanteTrocaOleo <= 500) {
        setAlerts((prevAlerts) => [
          ...prevAlerts,
          `Alerta: O veículo ${vehicle.nome} está a ${kmRestanteTrocaOleo} km da quilometragem para troca de óleo.`
        ]);
      }
    }
  };

  useEffect(() => {
    setAlerts([]); // Limpa os alertas antigos antes de recalcular
    vehicles.forEach(vehicle => {
      checkForOilChangeAlert(vehicle);
    });
  }, [vehicles]);

  return (
    <div>
      <h2>Dashboard de Veículos</h2>
      {alerts.map((alert, index) => (
        <div key={index} className="alert alert-warning">{alert}</div>
      ))}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Km Atual</th>
            <th>Troca de Óleo (Km)</th>
            <th>Em Uso</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(vehicle => (
            <tr key={vehicle._id}>
              <td>{vehicle.nome}</td>
              <td>{vehicle.modelo}</td>
              <td>{vehicle.marca}</td>
              <td>{vehicle.fleet.kmEntrada}</td>
              <td>{vehicle.fleet.trocaOleoKm}</td>
              <td>{vehicle.fleet.emUso ? 'Sim' : 'Não'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default VehicleDashboard;

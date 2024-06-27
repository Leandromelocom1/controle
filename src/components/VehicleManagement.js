import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VehicleExitForm = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [kmAtual, setKmAtual] = useState('');
  const [avarias, setAvarias] = useState('');

  useEffect(() => {
    // Fetch vehicles and drivers
    axios.get('/assets')
      .then(response => setVehicles(response.data))
      .catch(error => console.error('Erro ao buscar os ativos:', error));

    axios.get('/drivers')
      .then(response => setDrivers(response.data))
      .catch(error => console.error('Erro ao buscar os motoristas:', error));
  }, []);

  const handleExit = () => {
    axios.post('/fleet/saida', {
      assetId: selectedVehicle,
      kmAtual,
      motoristaId: selectedDriver,
      avarias
    })
    .then(response => alert('Saída registrada com sucesso'))
    .catch(error => console.error('Erro ao registrar a saída do veículo:', error));
  };

  return (
    <div>
      <h2>Saída de Veículo</h2>
      <form onSubmit={handleExit}>
        <div>
          <label>Veículo:</label>
          <select value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}>
            <option value="">Selecione um veículo</option>
            {vehicles.map(vehicle => (
              <option key={vehicle._id} value={vehicle._id}>{vehicle.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Motorista:</label>
          <select value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value)}>
            <option value="">Selecione um motorista</option>
            {drivers.map(driver => (
              <option key={driver._id} value={driver._id}>{driver.nome}</option>
            ))}
          </select>
        </div>
        <div>
          <label>KM Atual:</label>
          <input type="number" value={kmAtual} onChange={(e) => setKmAtual(e.target.value)} />
        </div>
        <div>
          <label>Avarias:</label>
          <textarea value={avarias} onChange={(e) => setAvarias(e.target.value)} />
        </div>
        <button type="submit">Registrar Saída</button>
      </form>
    </div>
  );
};

export default VehicleExitForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VehicleEntryForm = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [kmAtual, setKmAtual] = useState('');
  const [avarias, setAvarias] = useState('');

  useEffect(() => {
    // Fetch all vehicles that are currently not available
    axios.get('http://192.168.0.78:5000/assets')
      .then(response => {
        const unavailableVehicles = response.data.filter(vehicle => !vehicle.disponivel);
        setVehicles(unavailableVehicles);
      })
      .catch(error => {
        console.error('Error fetching vehicles:', error);
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      assetId: selectedVehicle,
      kmAtual,
      avarias
    };

    axios.post('http://192.168.0.78:5000/fleet/entrada', data)
      .then(response => {
        alert('Entrada registrada com sucesso!');
        // Atualizar a lista de veículos não disponíveis
        setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle._id !== selectedVehicle));
      })
      .catch(error => {
        console.error('Error registering vehicle entry:', error);
        alert('Erro ao registrar entrada do veículo.');
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Veículo:</label>
        <select value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)} required>
          <option value="">Selecione o veículo</option>
          {vehicles.map(vehicle => (
            <option key={vehicle._id} value={vehicle._id}>{vehicle.nome}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Km Atual:</label>
        <input type="number" value={kmAtual} onChange={(e) => setKmAtual(e.target.value)} required />
      </div>
      <div>
        <label>Avarias:</label>
        <textarea value={avarias} onChange={(e) => setAvarias(e.target.value)}></textarea>
      </div>
      <button type="submit">Registrar Entrada</button>
    </form>
  );
};

export default VehicleEntryForm;

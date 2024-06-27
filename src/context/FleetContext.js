import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const FleetContext = createContext();

export const FleetProvider = ({ children }) => {
  const [fleetData, setFleetData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFleetData();
  }, []);

  const fetchFleetData = async () => {
    try {
      const response = await axios.get('/assets');
      setFleetData(response.data);
    } catch (error) {
      console.error('Erro ao buscar os dados da frota:', error);
      setError(error);
    }
  };

  const addFleet = async (id, fleet) => {
    try {
      const response = await axios.post(`/assets/${id}/fleet`, fleet);
      setFleetData((prevFleetData) =>
        prevFleetData.map((asset) => (asset._id === id ? response.data : asset))
      );
    } catch (error) {
      console.error('Erro ao adicionar dados da frota:', error);
      setError(error);
    }
  };

  return (
    <FleetContext.Provider value={{ fleetData, fetchFleetData, addFleet, error }}>
      {children}
    </FleetContext.Provider>
  );
};

export default FleetContext;

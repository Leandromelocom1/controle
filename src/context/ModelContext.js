// src/context/ModelContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const ModelContext = createContext();

export const ModelProvider = ({ children }) => {
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/models`);
        setModels(response.data);
      } catch (error) {
        console.error('Erro ao buscar os modelos:', error);
      }
    };
    fetchModels();
  }, []);

  const addModel = async (name) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      const response = await axios.post(`${apiUrl}/models`, { name });
      setModels((prevModels) => [...prevModels, response.data]);
    } catch (error) {
      console.error('Erro ao adicionar o modelo:', error);
    }
  };

  return (
    <ModelContext.Provider value={{ models, addModel }}>
      {children}
    </ModelContext.Provider>
  );
};

export default ModelContext;

// src/context/AssetContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AssetContext = createContext();

export const AssetProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      const response = await axios.get(`${apiUrl}/assets`);
      setAssets(response.data);
    } catch (error) {
      console.error('Erro ao buscar os ativos:', error);
    }
  };

  const addAsset = async (assetDetails) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      const response = await axios.post(`${apiUrl}/assets`, assetDetails);
      setAssets((prevAssets) => [...prevAssets, response.data]);
    } catch (error) {
      console.error('Erro ao adicionar ativo:', error);
    }
  };

  return (
    <AssetContext.Provider value={{ assets, addAsset, fetchAssets }}>
      {children}
    </AssetContext.Provider>
  );
};

export default AssetContext;

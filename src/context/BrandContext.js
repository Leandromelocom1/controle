// src/context/BrandContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const BrandContext = createContext();

export const BrandProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/brands`);
        setBrands(response.data);
      } catch (error) {
        console.error('Erro ao buscar as marcas:', error);
      }
    };

    fetchBrands();
  }, []);

  const addBrand = async (name) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      const response = await axios.post(`${apiUrl}/brands`, { name });
      setBrands((prevBrands) => [...prevBrands, response.data]);
    } catch (error) {
      console.error('Erro ao adicionar a marca:', error);
    }
  };

  return (
    <BrandContext.Provider value={{ brands, addBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

export default BrandContext;

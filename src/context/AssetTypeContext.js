// src/context/AssetTypeContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AssetTypeContext = createContext();

export const AssetTypeProvider = ({ children }) => {
  const [assetTypes, setAssetTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      const [assetTypesResponse, brandsResponse, modelsResponse, departmentsResponse] = await Promise.all([
        axios.get(`${apiUrl}/asset-types`),
        axios.get(`${apiUrl}/brands`),
        axios.get(`${apiUrl}/models`),
        axios.get(`${apiUrl}/departments`),
      ]);
      setAssetTypes(assetTypesResponse.data);
      setBrands(brandsResponse.data);
      setModels(modelsResponse.data);
      setDepartments(departmentsResponse.data);
    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
    }
  };

  const addAssetType = async (typeName) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      const response = await axios.post(`${apiUrl}/asset-types`, { typeName });
      setAssetTypes((prevAssetTypes) => [...prevAssetTypes, response.data]);
    } catch (error) {
      console.error('Erro ao adicionar o tipo de ativo:', error);
    }
  };

  const addBrand = async (name) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      const response = await axios.post(`${apiUrl}/brands`, { name });
      setBrands((prevBrands) => [...prevBrands, response.data]);
    } catch (error) {
      console.error('Erro ao adicionar a marca:', error);
    }
  };

  const addModel = async (name) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      const response = await axios.post(`${apiUrl}/models`, { name });
      setModels((prevModels) => [...prevModels, response.data]);
    } catch (error) {
      console.error('Erro ao adicionar o modelo:', error);
    }
  };

  const addDepartment = async (name) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
      const response = await axios.post(`${apiUrl}/departments`, { name });
      setDepartments((prevDepartments) => [...prevDepartments, response.data]);
    } catch (error) {
      console.error('Erro ao adicionar o departamento:', error);
    }
  };

  return (
    <AssetTypeContext.Provider value={{ assetTypes, brands, models, departments, addAssetType, addBrand, addModel, addDepartment }}>
      {children}
    </AssetTypeContext.Provider>
  );
};

export default AssetTypeContext;

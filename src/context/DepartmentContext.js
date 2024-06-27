// src/context/DepartmentContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const DepartmentContext = createContext();

export const DepartmentProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://192.168.0.78:5000';
        const response = await axios.get(`${apiUrl}/departments`);
        setDepartments(response.data);
      } catch (error) {
        console.error('Erro ao buscar os departamentos:', error);
      }
    };

    fetchDepartments();
  }, []);

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
    <DepartmentContext.Provider value={{ departments, addDepartment }}>
      {children}
    </DepartmentContext.Provider>
  );
};

export default DepartmentContext;

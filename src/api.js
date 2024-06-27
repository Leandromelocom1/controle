// src/api.js
import axios from 'axios';

// Função de login
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { username, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao fazer login');
  }
};

// Exemplo de uma função autenticada para buscar ativos
export const fetchAssets = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/assets`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar os ativos');
  }
};

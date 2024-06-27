import axios from 'axios';

// Função para obter o token armazenado no localStorage
const getToken = () => localStorage.getItem('token');

// Configuração padrão do Axios para incluir o token JWT em cada requisição
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
